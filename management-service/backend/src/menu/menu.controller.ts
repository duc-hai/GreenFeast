import { Controller, HttpStatus, Post, UploadedFile, UseInterceptors, Res } from '@nestjs/common';
import { MenuService } from './menu.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOption } from 'src/config/multer.config';
import { Response } from 'express';

@Controller('menu')
export class MenuController {
    constructor(private menuService: MenuService) {}

    //Path: GET: /menu/get-all
    // @Get('/get-all')
    // findAll(): string {
    //     return 'All menu';
    // }

    @Post('/create')
    @UseInterceptors(FileInterceptor('image', multerOption)) //use FileInterceptor() into route handler and get 'image' from decorator 'request' by @Uploadfile() //image is filed name
    //FileInterceptor() might not compatible with third-party cloud providers such as Google Firebase. In this case, I use Cloudinary instead of other providers
    async createMenu(@UploadedFile() file: Express.Multer.File, @Res() res: Response): Promise<any> {
        //@Body() body: CreateMenuDto,
        try {
            //console.log(file)
            const result = await this.menuService.createMenu(file)

            return res.status(HttpStatus.FOUND).json({status: 'success', message: 'Thêm thực đơn thành công', data: result})
        }
        catch (err) {
            return res.status(HttpStatus.FORBIDDEN).json({status: 'error', message: `${err.message}`})
        }
    }
}
