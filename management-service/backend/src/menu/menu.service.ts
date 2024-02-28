import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from 'src/entities/menu.entity';
import { Like, Repository } from 'typeorm';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import { CreateMenuDto } from './dto/create-menu.dto';
import { Category } from 'src/entities/category.entity';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';
import * as sharp from 'sharp';

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(Menu) private menuRepository: Repository<Menu>,

        @InjectRepository(Category) private categoryRepository: Repository<Category>,

        private readonly rabbitMQService: RabbitmqService
    ) {}

    async getAllMenu(pageQuery: number, perPageQuery: number): Promise<any> {
        try {
            //Pagination
            const page = pageQuery || 1 //Default is 1
            const perPage = perPageQuery || parseInt(process.env.PER_PAGE_MENU) || 10 //Each page get 10 items

            const skip = (perPage * page) - perPage //In first page, skip 0 index

            const [result, total] = await this.menuRepository.findAndCount({
                where: {
                    isDeleted: false
                },
                take: perPage,
                skip: skip,
                order: {
                    name: "ASC",
                    updated_at: "DESC",
                    created_at: "DESC",
                }
            })

            const paginationResult = {
                currentPage: page,
                totalItems: total,
                eachPage: perPage,
                totalPage: Math.ceil(total / perPage)
            }

            return {
                result, paginationResult
            }
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

    async getByCategory (categoryId : number): Promise<any> {
        try {
            if (!categoryId) 
                throw new HttpException({
                    status: 'error',
                    message: `Thiếu dữ liệu danh mục`,
                }, HttpStatus.FORBIDDEN, {
                    cause: 'Thiếu dữ liệu danh mục' 
                })

            if (typeof(categoryId) === 'string')
                categoryId = parseInt(categoryId)

            const result = await this.menuRepository.find({
                where: {
                    isDeleted: false,
                    category_id: categoryId
                },
                order: {
                    name: "ASC"
                }
            })

            if (!result)
                throw new HttpException({
                    status: 'error',
                    message: `Không tìm thấy thực đơn hợp lệ`,
                }, HttpStatus.FORBIDDEN, {
                    cause: 'Không tìm thấy thực đơn hợp lệ' 
                })

            return result 
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

    async createMenu(file: Express.Multer.File, createMenuDto: CreateMenuDto): Promise<any> {
        try {
            // console.log(file)
            // console.log(createMenuDto)

            if (!file) 
                throw new HttpException({
                    status: 'error',
                    message: `Lỗi khi tải file lên`,
                }, HttpStatus.FORBIDDEN, {
                    cause: `Lỗi khi tải file lên`
                })

            //Convert for the right data type
            if (typeof(createMenuDto.price) === 'string')
                createMenuDto.price = parseInt(createMenuDto.price)

            if (typeof(createMenuDto.category_id) === 'string')
                createMenuDto.category_id = parseInt(createMenuDto.category_id)

            //Check foreign key of category table
            const checkForeignKeyCategory = await this.categoryRepository.findOneBy({
                id: createMenuDto.category_id,
                isDeleted: false
            })

            if (!checkForeignKeyCategory)
                throw new HttpException({
                    status: 'error',
                    message: `Danh mục không hợp lệ`,
                }, HttpStatus.FORBIDDEN, {
                    cause: `Danh mục không hợp lệ`
                })

            //Config cloudinary path to upload
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET
            })

            //Resize image
            //console.log(file.path) //inputPath
            const outputPath = 'upload/image.jpg'
            const newWidth = 800
            const inputBuffer = fs.readFileSync(file.path)

            const resizedImage = await sharp(inputBuffer)
                .resize({ width: newWidth })
                .toBuffer()

            // Save image after resize
            fs.writeFileSync(outputPath, resizedImage)

            const result = await cloudinary.uploader.upload(outputPath, { unique_filename: true }) //If error occur, 'catch exception' below will handle it

            //Add data into database
            const menuData = {
                ...{
                    image: result.secure_url,
                    created_at: new Date()
                },
                ... createMenuDto
            } //JS Spread

            const menu = await this.menuRepository.create(menuData)

            await this.menuRepository.save(menu)

            this.removeImageAfterUploadCloud(file.path)
            this.removeImageAfterUploadCloud(outputPath)

            this.rabbitMQService.sendMessage('management-order', {
                title: 'menu',
                action: 'create',
                data: menu
            })

            return menu
        }
        catch (err) {
            //If 'file' is truthy, it's means that image uploaded on server, we need to remove it (whether success or failure)
            if (file)
                this.removeImageAfterUploadCloud(file.path)
            throw new HttpException({
                status: 'error',
                message: `${err.message}`,
            }, HttpStatus.FORBIDDEN, {
                cause: err 
            })
        }
    }

    async updateMenu (file: Express.Multer.File, updateMenuDto: UpdateMenuDto, id: number): Promise<any> {
        try {
            // console.log(file)

            if (!id) 
                throw new HttpException({
                    status: 'error',
                    message: `Thiếu mã thực đơn`,
                }, HttpStatus.FORBIDDEN, {
                    cause: 'Thiếu mã thực đơn' 
                })

            if (updateMenuDto.category_id) {
                //Check foreign key of category table
                const checkForeignKeyCategory = await this.categoryRepository.findOneBy({
                    id: updateMenuDto.category_id,
                    isDeleted: false
                })

                if (!checkForeignKeyCategory)
                    throw new HttpException({
                        status: 'error',
                        message: `Danh mục không hợp lệ`,
                    }, HttpStatus.FORBIDDEN, {
                        cause: `Danh mục không hợp lệ`
                    })
            }

            let resultCloudinary = null

            if (file) {
                //Config cloudinary path to upload
                cloudinary.config({
                    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                    api_key: process.env.CLOUDINARY_API_KEY,
                    api_secret: process.env.CLOUDINARY_API_SECRET
                })

                resultCloudinary = await cloudinary.uploader.upload(file.path, { unique_filename: true }) //If error occur, 'catch exception' below will handle it

                this.removeImageAfterUploadCloud(file.path)
            }

            const updateData = {
                ... updateMenuDto,
                ... {
                    updated_at: new Date(),
                }
            }

            if (resultCloudinary) 
                Object.assign(updateData, { image: resultCloudinary.secure_url })

            const resultUpdate = await this.menuRepository.update({
                id: id,
                isDeleted: false
            }, updateData)

            if (resultUpdate.affected === 0) 
                throw new HttpException({
                    status: 'error',
                    message: `Không tìm thấy món ăn hoặc có lỗi xảy ra`,
                }, HttpStatus.FORBIDDEN, {
                    cause: 'Không tìm thấy món ăn hoặc có lỗi xảy ra'
                })
            
            this.rabbitMQService.sendMessage('management-order', {
                title: 'menu',
                action: 'update',
                data: updateMenuDto,
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

    async removeImageAfterUploadCloud (filePath: string): Promise<any> {
        fs.unlink(filePath, err => {
            if (err)
                console.error(`Xảy ra lỗi khi xóa file: ${err}`)
        })

        //console.log('Xóa thành công file local')
    }

    async deleteMenu(id: number): Promise<any> {
        try {
            if (!id) 
                throw new HttpException({
                    status: 'error',
                    message: `Thiếu mã thực đơn`,
                }, HttpStatus.FORBIDDEN, {
                    cause: 'Thiếu mã thực đơn' 
                })

            //Soft delete
            const result = await this.menuRepository.update({
                id: id,
                isDeleted: false
            }, {
                isDeleted: true,
                deleted_at: new Date()
            })
            
            if (result.affected === 0) 
                throw new HttpException({
                    status: 'error',
                    message: `Không tìm thấy thực đơn`,
                }, HttpStatus.FORBIDDEN, {
                    cause: 'Không tìm thấy thực đơn' 
                })

            this.rabbitMQService.sendMessage('management-order', {
                title: 'menu',
                action: 'delete',
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

    async searchMenu(keyword: string): Promise<any> {
        try {
            if (!keyword) 
                throw new HttpException({
                    status: 'error',
                    message: `Thiếu từ khóa tìm kiếm`,
                }, HttpStatus.FORBIDDEN, {
                    cause: 'Thiếu từ khóa tìm kiếm' 
                })

            const searchKeywordTypeOrm = `%${keyword.split('').join('%')}%`
            
            const result = await this.menuRepository.find({
                where: [
                    //not case sensitive 
                    { name: Like(`%${keyword}%`), isDeleted: false }, //Search by keyword. Eg: chay -> "Món chay ngon"
                    { name: Like(searchKeywordTypeOrm), isDeleted: false } //Search by acronyms. Eg: mc -> "Món chay"
                ]
            })

            return result
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
