import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from 'entities/menu.entity';
import { Repository } from 'typeorm';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(Menu) private menuRepository: Repository<Menu>
    ) {}

    async createMenu(file: Express.Multer.File): Promise<any> {
        try {
            //console.log(file)

            if (!file)
                throw new HttpException({
                    status: 'error',
                    message: `Đã xảy ra lỗi với file`,
                }, HttpStatus.FORBIDDEN, {
                    cause: `Đã xảy ra lỗi với file`
                })
                
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET
            })

            const result = await cloudinary.uploader.upload(file.path, { unique_filename: true }) //If error occur, 'catch exception' below will handle it

            //Add data into database
            const menuData = {
                ...{
                    image: result.secure_url,
                    created_at: new Date()
                },
                ... {}
            } //JS Spread

            const menu = await this.menuRepository.create(menuData)

            await this.menuRepository.save(menu)

            this.removeImageAfterUploadCloud(file.path)

            return menu
        }
        catch (err) {
            this.removeImageAfterUploadCloud(file.path)
            throw new HttpException({
                status: 'error',
                message: `${err.message}`,
            }, HttpStatus.FORBIDDEN, {
                cause: err 
            })
        }
    }

    async removeImageAfterUploadCloud (filePath: string): Promise<any> {
        fs.unlink(filePath, (err) => {
            if (err)
                console.error(`Xảy ra lỗi khi xóa file: ${err}`)
        })

        //console.log('Xóa thành công file local')
    }
}
