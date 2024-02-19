import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { Response } from 'express';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Controller('promotion')
export class PromotionController {
    constructor (private promotionService: PromotionService) {}

    @Get('/get-all')
    async findAll(@Res() res: Response): Promise<any> {
        try {
            const result = await this.promotionService.findAllPromotion()

            return res.status(HttpStatus.FOUND).json({status: 'success', message: 'Lấy danh sách thành công', data: result})
        }
        catch (err) {
            return res.status(HttpStatus.FORBIDDEN).json({status: 'error', message: `${err.message}`})
        }
    }

    @Post('/create')
    async createPromotion(@Res() res: Response, @Body() createPromotionDto: CreatePromotionDto): Promise<any> {
        try {
            const result = await this.promotionService.createPromotion(createPromotionDto)

            return res.status(HttpStatus.FOUND).json({status: 'success', message: 'Thêm khuyến mãi thành công', data: result})

        }
        catch (err) {
            return res.status(HttpStatus.FORBIDDEN).json({status: 'error', message: `${err.message}`})
        }
    }

    @Put('/update/:id')
    async updatePromotion(@Res() res: Response, @Body() updatePromotionDto: UpdatePromotionDto, @Param() param: any): Promise<any> {
        try {
            const result = await this.promotionService.updatePromotion(updatePromotionDto, param.id)

            return res.status(HttpStatus.FOUND).json({status: 'success', message: 'Cập nhật khuyến mãi thành công', data: result})

        }
        catch (err) {
            return res.status(HttpStatus.FORBIDDEN).json({status: 'error', message: `${err.message}`})
        }
    }

    @Delete('/delete/:id')
    async removePromotion (@Res() res: Response, @Param() param: any): Promise<any> {
        try {
            await this.promotionService.removePromotion(param.id)

            return res.status(HttpStatus.FOUND).json({status: 'success', message: 'Đã xóa khuyến mãi thành công'})
        }
        catch (err) {
            return res.status(HttpStatus.FORBIDDEN).json({status: 'error', message: `${err.message}`})
        }
    }

    @Get('/get-form-promotion')
    async getFormPromotion (@Res() res: Response): Promise<any> {
        try {
            const result = await this.promotionService.getFormPromotion()

            return res.status(HttpStatus.FOUND).json({status: 'success', message: 'Thành công', data: result})
        }
        catch (err) {
            return res.status(HttpStatus.FORBIDDEN).json({status: 'error', message: `${err.message}`})
        }
    }
}
