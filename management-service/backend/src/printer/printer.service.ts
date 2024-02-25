import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePrinterDto } from './dto/create-printer.dto';
import * as fs from 'fs';
import { join } from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Printer } from 'src/entities/printer.entity';
import { Area } from 'src/entities/area.entity';
import { UpdatePrinterDto } from './dto/update-printer.dto';

@Injectable()
export class PrinterService {
    constructor(
        @InjectRepository(Printer) private printerRepository: Repository<Printer>,

        @InjectRepository(Area) private areaRepository: Repository<Area>,
    ) {}

    async getAllPrinter(): Promise<any> {
        try {
            const resultDataFromDB = await this.printerRepository.find({
                where: {
                    isDeleted: false,
                },
                order: {
                    name: "ASC",
                    updated_at: "DESC",
                    created_at: "DESC",
                }
            })

            const referencePrinterType =  JSON.parse(fs.readFileSync(join(process.cwd(), './src/reference-data/printer-type.json')).toString())
            
            const keysValuesArray = Object.entries(referencePrinterType)

            const returnData = resultDataFromDB.map(value => {
                for (let element of keysValuesArray) {
                    if (parseInt(element[0]) === value.printer_type) {
                        value['printer_type_name'] = element[1]
                        break
                    }
                }
                    
                return value
            })

            return returnData
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

    async getPrinterType(): Promise<any> {
        try {
            return JSON.parse(fs.readFileSync(join(process.cwd(), './src/reference-data/printer-type.json')).toString())
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

    async createPrinterConnection(createPrinterDto: CreatePrinterDto): Promise<any> {
        try {
            if (!createPrinterDto)
                throw new HttpException({
                    status: 'error',
                    message: `Dữ liệu không hợp lệ`,
                }, HttpStatus.FORBIDDEN, {
                    cause: 'Dữ liệu không hợp lệ' 
                })

            if (!this.checkValidPrinterType(createPrinterDto.printer_type))
                throw new HttpException({
                    status: 'error',
                    message: `Loại máy in không hợp lệ`,
                }, HttpStatus.FORBIDDEN, {
                    cause: 'Loại máy in không hợp lệ' 
                })

            if (createPrinterDto.printer_type !== 1 && createPrinterDto.area_id)
                throw new HttpException({
                    status: 'error',
                    message: `Không phải máy in hóa đơn nên không cần mã khu vực`,
                }, HttpStatus.FORBIDDEN, {
                    cause: 'Không phải máy in hóa đơn nên không cần mã khu vực' 
                })

            if (createPrinterDto.printer_type === 1 && createPrinterDto.area_id) {
                const checkAreaId = await this.areaRepository.existsBy({
                    id: createPrinterDto.area_id,
                    isDeleted: false,
                })

                if (!checkAreaId)
                    throw new HttpException({
                        status: 'error',
                        message: `Mã khu vực không hợp lệ`,
                    }, HttpStatus.FORBIDDEN, {
                        cause: 'Mã khu vực không hợp lệ' 
                    })
            }
            else if (createPrinterDto.printer_type === 1 && !createPrinterDto.area_id)
                throw new HttpException({
                    status: 'error',
                    message: `Loại máy in "In hóa đơn" phải có mã khu vực đính kèm`,
                }, HttpStatus.FORBIDDEN, {
                    cause: 'Loại máy in "In hóa đơn" phải có mã khu vực đính kèm' 
                })

            const createData = {
                ...createPrinterDto,
                ... {
                    created_at: new Date()
                }
            }

            const printer = await this.printerRepository.create(createData)

            await this.printerRepository.save(printer)

            return printer
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

    checkValidPrinterType(printerType: number): boolean {
        //Check printer type is valid or not
        const referencePrinterType =  JSON.parse(fs.readFileSync(join(process.cwd(), './src/reference-data/printer-type.json')).toString())    

        return Object.keys(referencePrinterType).some(value => parseInt(value) === printerType)
    }

    async updatePrinter (updatePrinterDto: UpdatePrinterDto, id: number): Promise<any> {
        try {
            if (!id) 
                throw new HttpException({
                    status: 'error',
                    message: `Thiếu mã máy in`,
                }, HttpStatus.FORBIDDEN, {
                    cause: 'Thiếu mã máy in' 
                })

            if (!updatePrinterDto)
                throw new HttpException({
                    status: 'error',
                    message: `Dữ liệu không hợp lệ`,
                }, HttpStatus.FORBIDDEN, {
                    cause: 'Dữ liệu không hợp lệ' 
                })

            if (updatePrinterDto.printer_type) {
                //Check valid printer type
                if (!this.checkValidPrinterType(updatePrinterDto.printer_type))
                    throw new HttpException({
                        status: 'error',
                        message: `Loại máy in không hợp lệ`,
                    }, HttpStatus.FORBIDDEN, {
                        cause: 'Loại máy in không hợp lệ' 
                    })
                
                if (updatePrinterDto.printer_type !== 1 && updatePrinterDto.area_id)
                    throw new HttpException({
                        status: 'error',
                        message: `Không phải máy in hóa đơn nên không cần mã khu vực`,
                    }, HttpStatus.FORBIDDEN, {
                        cause: 'Không phải máy in hóa đơn nên không cần mã khu vực' 
                    })

                if (updatePrinterDto.printer_type === 1 && updatePrinterDto.area_id) {
                    if (!(await this.areaRepository.existsBy({
                        id: updatePrinterDto.area_id,
                        isDeleted: false,
                    })))
                        throw new HttpException({
                            status: 'error',
                            message: `Mã khu vực không hợp lệ`,
                        }, HttpStatus.FORBIDDEN, {
                            cause: 'Mã khu vực không hợp lệ' 
                        })
                }
                else if (updatePrinterDto.printer_type === 1 && !updatePrinterDto.area_id) 
                    throw new HttpException({
                        status: 'error',
                        message: `Loại máy in "In hóa đơn" phải có mã khu vực đính kèm`,
                    }, HttpStatus.FORBIDDEN, {
                        cause: 'Loại máy in "In hóa đơn" phải có mã khu vực đính kèm' 
                    })
            }

            const updateData = {
                ... updatePrinterDto,
                ... {
                    updated_at: new Date(),
                }
            }

            const resultUpdate = await this.printerRepository.update({
                id: id,
                isDeleted: false,
            }, updateData)

            if (resultUpdate.affected === 0)
                throw new HttpException({
                    status: 'error',
                    message: `Không tìm thấy máy in hoặc đã xảy ra lỗi`,
                }, HttpStatus.FORBIDDEN, {
                    cause: 'Không tìm thấy máy in hoặc đã xảy ra lỗi'
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
    
    async removePrinter(id: number): Promise<any> {
        try {
            if (!id) 
                throw new HttpException({
                    status: 'error',
                    message: `Thiếu mã khuyến mãi`,
                }, HttpStatus.FORBIDDEN, {
                    cause: 'Thiếu mã khuyến mãi' 
                })
            
            //Soft delete
            const result = await this.printerRepository.update({
                id: id,
                isDeleted: false
            }, {
                isDeleted: true,
                deleted_at: new Date()
            })

            if (result.affected === 0) 
                throw new HttpException({
                    status: 'error',
                    message: `Không tìm thấy máy in hoặc đã xảy ra lỗi khi xóa`,
                }, HttpStatus.FORBIDDEN, {
                    cause: 'Không tìm thấy máy in hoặc đã xảy ra lỗi khi xóa' 
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
}
