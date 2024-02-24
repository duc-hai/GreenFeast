import { Controller, HttpStatus, Post, UploadedFile, UseInterceptors, Res, Body, Get, Query, Param, Put, Delete, Req } from '@nestjs/common';
import { MenuService } from './menu.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOption } from 'src/config/multer.config';
import { Response } from 'express';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Controller('menu')
export class MenuController {
    constructor(private menuService: MenuService) {}

    //Path: GET: /menu/get-all
    @Get('/get-all')
    async findAll(@Res() res: Response, @Query('page') page, @Query('perPage') perPage, @Req() req): Promise<any> {
        try {
            // console.log(JSON.parse(decodeURIComponent(req.headers['user-infor-header']))) // -> Working
           
            const {result, paginationResult} = await this.menuService.getAllMenu(page, perPage)

            return res.status(HttpStatus.OK).json({status: 'success', message: 'Lấy danh sách thành công', paginationResult, data: result})
        }
        catch (err) {
            return res.status(HttpStatus.FORBIDDEN).json({status: 'error', message: `${err.message}`})
        }
    }

    @Get('/search')
    async searchMenu(@Res() res: Response, @Query('keyword') keyword): Promise<any> {
        try {
            const result = await this.menuService.searchMenu(keyword)

            return res.status(HttpStatus.OK).json({status: 'success', message: 'Lấy danh sách thành công', data: result})
        }
        catch (err) {
            return res.status(HttpStatus.FORBIDDEN).json({status: 'error', message: `${err.message}`})
        }
    }

    @Get('/get-by-category/:id')
    async getByCategory (@Param() param: any, @Res() res: Response): Promise<any> {
        try {
            const result = await this.menuService.getByCategory(param.id)

            return res.status(HttpStatus.OK).json({status: 'success', message: 'Lấy danh sách thành công', data: result})
        }
        catch (err) {
            return res.status(HttpStatus.FORBIDDEN).json({status: 'error', message: `${err.message}`}) 
        }
    }

    @Post('/create')
    @UseInterceptors(FileInterceptor('image', multerOption)) //use FileInterceptor() into route handler and get 'image' from decorator 'request' by @Uploadfile() //image is filed name
    //FileInterceptor() might not compatible with third-party cloud providers such as Google Firebase. In this case, I use Cloudinary instead of other providers
    async createMenu(@UploadedFile() file: Express.Multer.File, @Res() res: Response, @Body() createMenuDto: CreateMenuDto): Promise<any> {
        try {
            //console.log(file)
            const result = await this.menuService.createMenu(file, createMenuDto)

            return res.status(HttpStatus.OK).json({status: 'success', message: 'Thêm thực đơn thành công', data: result})
        }
        catch (err) {
            return res.status(HttpStatus.FORBIDDEN).json({status: 'error', message: `${err.message}`})
        }
    }

    @Put('/update/:id')
    @UseInterceptors(FileInterceptor('image', multerOption))
    async updateMenu (@UploadedFile() file: Express.Multer.File, @Res() res: Response, @Param() param: any, @Body() updateMenuDto: UpdateMenuDto): Promise<any> {
        try {
            await this.menuService.updateMenu(file, updateMenuDto, param.id)

            return res.status(HttpStatus.OK).json({status: 'success', message: 'Cập nhật thực đơn thành công'})
        }
        catch (err) {
            return res.status(HttpStatus.FORBIDDEN).json({status: 'error', message: `${err.message}`})
        }
    }

    @Delete('/delete/:id')
    async deleteMenu(@Res() res: Response, @Param() param: any): Promise<any> {
        try {
            await this.menuService.deleteMenu(param.id)

            return res.status(HttpStatus.OK).json({status: 'success', message: 'Đã xóa thực đơn thành công'})
        }
        catch (err) {
            return res.status(HttpStatus.FORBIDDEN).json({status: 'error', message: `${err.message}`})
        }
    }
}
