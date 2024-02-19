import { Response } from 'express';
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @Get('/get-all')
    async findAllCategories(@Res() res: Response): Promise<any> {
        try {
            const result = await this.categoryService.findAllCategories();
            
            return res.status(HttpStatus.FOUND).json({status: 'success', message: 'Lấy danh sách thành công', data: result})
        }
        catch (err) {
            return res.status(HttpStatus.FORBIDDEN).json({status: 'error', message: `${err.message}`})
        }
    }

    @Post('/create')
    async createCategory(@Res() res: Response, @Body() createCategoryDto: CreateCategoryDto) {
        try {
            const result = await this.categoryService.createCategory(createCategoryDto);

            return res.status(HttpStatus.FOUND).json({status: 'success', message: 'Đã thêm danh mục món thành công', data: result})
        }
        catch (err) {
            return res.status(HttpStatus.FORBIDDEN).json({status: 'error', message: `${err.message}`})
        }
    }

    @Put('/update/:id')
    async updateCategory (@Res() res: Response, @Param() params: any, @Body() updateCategoryDto: CreateCategoryDto): Promise<any> {
        try {
            await this.categoryService.updateCategory(params.id, updateCategoryDto);

            return res.status(HttpStatus.FOUND).json({status: 'success', message: 'Cập nhật danh mục thành công'})
        }
        catch (err) {
            return res.status(HttpStatus.FORBIDDEN).json({status: 'error', message: `${err.message}`})
        }
    }

    @Delete('/delete/:id')
    async deleteCategory (@Res() res: Response, @Param() params: any) {
        try {
            await this.categoryService.deleteCategory(params.id)

            return res.status(HttpStatus.FOUND).json({status: 'success', message: 'Đã xóa danh mục thành công'})
        }
        catch (err) {
            return res.status(HttpStatus.FORBIDDEN).json({status: 'error', message: `${err.message}`})
        }
    }
}
