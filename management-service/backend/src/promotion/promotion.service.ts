import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Promotion } from 'src/entities/promotion.entity';
import { Repository } from 'typeorm';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import * as fs from 'fs';
import { join } from 'path';
import { Menu } from 'src/entities/menu.entity';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';

@Injectable()
export class PromotionService {
    constructor(
        @InjectRepository(Promotion) private promotionRepository: Repository<Promotion>,
        
        @InjectRepository(Menu) private menuRepository: Repository<Menu>,

        private readonly rabbitMQService: RabbitmqService
    ) {}

    async getFormPromotion(): Promise<any> {
        try {
            return JSON.parse(fs.readFileSync(join(process.cwd(), './src/reference-data/form-promotion.json')).toString())
        }
        catch (err) {
            throw new HttpException({
                status: 'error',
                message: `${err.message}`,
            }, HttpStatus.FORBIDDEN, {
                cause: err 
            })
        }
    }

    async findAllPromotion(): Promise<any> {
        try {
            const resultDataFromDB = await this.promotionRepository.find({
                where: {
                    isDeleted: false,
                },
                order: {
                    updated_at: "DESC",
                    created_at: "DESC"
                }
            })

            //The promotion form should not only display numbers 1, 2, 3... but must also display specific names so that the client can understand.
            const referenceFormPromotion =  JSON.parse(fs.readFileSync(join(process.cwd(), './src/reference-data/form-promotion.json')).toString())

            const keysValuesArray = Object.entries(referenceFormPromotion)

            //In case it is not found, the form_promotion_name field will be ignored
            const newResult = resultDataFromDB.map(value => {
                for (let element of keysValuesArray) {
                    if (parseInt(element[0]) === value.form_promotion) {
                        value["form_promotion_name"] = element[1]
                        break
                    }
                }
                return value
            })
            
            return newResult
        }
        catch (err) {
            throw new HttpException({
                status: 'error',
                message: `${err.message}`,
            }, HttpStatus.FORBIDDEN, {
                cause: err 
            })
        }
    }

    async createPromotion(createPromotionDto: CreatePromotionDto): Promise<any> {
        try {
            if (!createPromotionDto)
                throw new HttpException({
                    status: 'error',
                    message: `Dữ liệu không hợp lệ`,
                }, HttpStatus.FORBIDDEN, {
                    cause: 'Dữ liệu không hợp lệ' 
                })

            //Read file form promotion and check its valid whether
            const referenceFormPromotion =  JSON.parse(fs.readFileSync(join(process.cwd(), './src/reference-data/form-promotion.json')).toString())

            const objectKeysArray = Object.keys(referenceFormPromotion)

            const checkValidFormPromotion = objectKeysArray.some(value => {
                return parseInt(value) == createPromotionDto.form_promotion
            })

            if (!checkValidFormPromotion)
                throw new HttpException({
                    status: 'error',
                    message: `Hình thức khuyến mãi không hợp lệ`,
                }, HttpStatus.FORBIDDEN, {
                    cause: 'Hình thức khuyến mãi không hợp lệ' 
                })

            //Check menu id for case apply for specific menu
            if (createPromotionDto.form_promotion == 2) {
                if (!await this.checkSpecificDish(createPromotionDto.condition_apply))
                    throw new HttpException({
                        status: 'error',
                        message: `Mã thực đơn không hợp lệ`,
                    }, HttpStatus.FORBIDDEN, {
                        cause: 'Mã thực đơn không hợp lệ' 
                    })
            }

            //Check value of 'promotion value'
            if (createPromotionDto.promotion_value.includes('%')) {
                const valueIntegerPercentage = parseInt(createPromotionDto.promotion_value.replace('%', ''))

                if (valueIntegerPercentage < -100 || valueIntegerPercentage > 100) 
                    throw new HttpException({
                        status: 'error',
                        message: `Phần trăm giảm giá phải nằm trong khoảng -100% đến 100%`,
                    }, HttpStatus.FORBIDDEN, {
                        cause: 'Phần trăm giảm giá phải nằm trong khoảng -100% đến 100%' 
                    })

                if (!this.isNumeric(createPromotionDto.promotion_value.replace('%', ''))) {
                    throw new HttpException({
                        status: 'error',
                        message: `Phần trăm giảm giá không hợp lệ`,
                    }, HttpStatus.FORBIDDEN, {
                        cause: 'Phần trăm giảm giá không hợp lệ' 
                    })
                }
            }
            else {
                if (!this.isNumeric(createPromotionDto.promotion_value))
                    throw new HttpException({
                        status: 'error',
                        message: `Số tiền giảm giá không hợp lệ`,
                    }, HttpStatus.FORBIDDEN, {
                        cause: 'Số tiền giảm giá không hợp lệ' 
                    })
            }

            const createData = {
                ... createPromotionDto,
                ... {
                    created_at: new Date()
                }
            }

            const promotion = await this.promotionRepository.create(createData)

            await this.promotionRepository.save(promotion)

            this.rabbitMQService.sendMessage('management-order', {
                title: 'promotion',
                action: 'create',
                data: promotion
            })

            return promotion
        }
        catch (err) {
            throw new HttpException({
                status: 'error',
                message: `${err.message}`,
            }, HttpStatus.FORBIDDEN, {
                cause: err 
            })
        }
    }

    async updatePromotion(updatePromotionDto: UpdatePromotionDto, id: number): Promise<any> {
        try {
            if (!id) 
                throw new HttpException({
                    status: 'error',
                    message: `Thiếu mã khuyến mãi`,
                }, HttpStatus.FORBIDDEN, {
                    cause: 'Thiếu mã khuyến mãi' 
                })

            if (!updatePromotionDto)
                throw new HttpException({
                    status: 'error',
                    message: `Dữ liệu không hợp lệ`,
                }, HttpStatus.FORBIDDEN, {
                    cause: 'Dữ liệu không hợp lệ' 
                })

            //Check id is valid in database
            const checkIdPromotion = await this.promotionRepository.existsBy({
                id: id,
                isDeleted: false,
            })

            if (!checkIdPromotion) 
                throw new HttpException({
                    status: 'error',
                    message: `Mã khuyến mãi không hợp lệ`,
                }, HttpStatus.FORBIDDEN, {
                    cause: 'Mã khuyến mãi không hợp lệ' 
                })

            //Check valid form promotion
            if (updatePromotionDto.form_promotion) {
                //Read file form promotion and check its valid whether
                const referenceFormPromotion =  JSON.parse(fs.readFileSync(join(process.cwd(), './src/reference-data/form-promotion.json')).toString())

                const objectKeysArray = Object.keys(referenceFormPromotion)

                const checkValidFormPromotion = objectKeysArray.some(value => {
                    return parseInt(value) == updatePromotionDto.form_promotion
                })

                if (!checkValidFormPromotion)
                    throw new HttpException({
                        status: 'error',
                        message: `Hình thức khuyến mãi không hợp lệ`,
                    }, HttpStatus.FORBIDDEN, {
                        cause: 'Hình thức khuyến mãi không hợp lệ' 
                    })

                if (updatePromotionDto.form_promotion == 2 && updatePromotionDto.condition_apply) {
                        if (!await this.checkSpecificDish(updatePromotionDto.condition_apply))
                            throw new HttpException({
                                status: 'error',
                                message: `Mã thực đơn không hợp lệ`,
                            }, HttpStatus.FORBIDDEN, {
                                cause: 'Mã thực đơn không hợp lệ' 
                            })
                    }
            }

            //Check valid promotion value
            if (updatePromotionDto.promotion_value) {
                if (updatePromotionDto.promotion_value.includes('%')) {
                    const valueIntegerPercentage = parseInt(updatePromotionDto.promotion_value.replace('%', ''))
    
                    if (valueIntegerPercentage < -100 || valueIntegerPercentage > 100) 
                        throw new HttpException({
                            status: 'error',
                            message: `Phần trăm giảm giá phải nằm trong khoảng -100% đến 100%`,
                        }, HttpStatus.FORBIDDEN, {
                            cause: 'Phần trăm giảm giá phải nằm trong khoảng -100% đến 100%' 
                        })
    
                    if (!this.isNumeric(updatePromotionDto.promotion_value.replace('%', ''))) {
                        throw new HttpException({
                            status: 'error',
                            message: `Phần trăm giảm giá không hợp lệ`,
                        }, HttpStatus.FORBIDDEN, {
                            cause: 'Phần trăm giảm giá không hợp lệ' 
                        })
                    }
                }
                else {
                    if (!this.isNumeric(updatePromotionDto.promotion_value))
                        throw new HttpException({
                            status: 'error',
                            message: `Số tiền giảm giá không hợp lệ`,
                        }, HttpStatus.FORBIDDEN, {
                            cause: 'Số tiền giảm giá không hợp lệ' 
                        })
                }
            }

            const updateData = {
                ... updatePromotionDto,
                ... {
                    updated_at: new Date(),
                }
            }

            const resultUpdate = await this.promotionRepository.update({
                id: id,
                isDeleted: false,
            }, updateData)

            if (resultUpdate.affected === 0)
                throw new HttpException({
                    status: 'error',
                    message: `Đã xảy ra lỗi`,
                }, HttpStatus.FORBIDDEN, {
                    cause: 'Đã xảy ra lỗi'
                })

            this.rabbitMQService.sendMessage('management-order', {
                title: 'promotion',
                action: 'update',
                data: updatePromotionDto,
                id
            })
        }
        catch (err) {
            throw new HttpException({
                status: 'error',
                message: `${err.message}`,
            }, HttpStatus.FORBIDDEN, {
                cause: err 
            })
        }
    }

    async removePromotion(id: number): Promise<any> {
        try {
            if (!id) 
                throw new HttpException({
                    status: 'error',
                    message: `Thiếu mã khuyến mãi`,
                }, HttpStatus.FORBIDDEN, {
                    cause: 'Thiếu mã khuyến mãi' 
                })
            
            const promotionDelete = await this.promotionRepository.findOneBy({ id: id,
                isDeleted: false })
            
            //Soft delete
            const result = await this.promotionRepository.update({
                id: id,
                isDeleted: false
            }, {
                isDeleted: true,
                deleted_at: new Date()
            })

            if (result.affected === 0) 
                throw new HttpException({
                    status: 'error',
                    message: `Không tìm thấy khuyến mãi, đã xảy ra lỗi khi xóa`,
                }, HttpStatus.FORBIDDEN, {
                    cause: 'Không tìm thấy khuyến mãi, đã xảy ra lỗi khi xóa' 
                })

            this.rabbitMQService.sendMessage('management-order', {
                title: 'promotion',
                action: 'delete',
                data: promotionDelete
            })    
        }
        catch (err) {
            throw new HttpException({
                status: 'error',
                message: `${err.message}`,
            }, HttpStatus.FORBIDDEN, {
                cause: err 
            })
        }
    }

    isNumeric(n: any): boolean {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    async checkSpecificDish (menuId: number): Promise<Boolean> {
        try {
            const checkMenuId = await this.menuRepository.findOneBy({
                id: menuId,
                isDeleted: false
            })

            if (checkMenuId) 
                return true
            return false
        }
        catch (err) {
            return false
        }
    }
}
