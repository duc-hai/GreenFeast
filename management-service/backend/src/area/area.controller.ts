import { Controller, Get, Post, Put, Delete, Res, HttpStatus, Body, Param } from '@nestjs/common';
import { AreaService } from './area.service';
import { Response } from 'express';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

@Controller('area')
export class AreaController {
    constructor(private areaService: AreaService) {}

    @Get('get-all')
    async findAllAreas (@Res() res : Response) : Promise<any> {
        try {
            const result = await this.areaService.getAllAreas();

            return res.status(HttpStatus.OK).json({status: 'success', message: 'Lấy danh sách thành công', data: result})
        }
        catch (err) {
            return res.status(HttpStatus.FORBIDDEN).json({status: 'error', message: `${err.message}`})
        }
    }

    @Post('create')
    async createArea (@Res() res: Response, @Body() createAreaDto: CreateAreaDto) : Promise<any> {
        try {
            //console.log(createAreaDto)
            const result = await this.areaService.createArea(createAreaDto);

            return res.status(HttpStatus.OK).json({status: 'success', message: 'Đã thêm khu vực thành công', data: result})
        }
        catch (err) {
            return res.status(HttpStatus.FORBIDDEN).json({status: 'error', message: `${err.message}`})
        }
    }

    // @Post('create-areas')
    // async createManyAreas () : Promise<any> {

    // }

    @Put('/update/:id')
    async updateArea (@Res() res: Response, @Param() params: any, @Body() updateTableDto: UpdateAreaDto) : Promise<any> {
        try {
            const result = await this.areaService.updateArea(params.id, updateTableDto);

            return res.status(HttpStatus.OK).json({status: 'success', message: 'Cập nhật khu vực thành công', data: result})
        }
        catch (err) {
            return res.status(HttpStatus.FORBIDDEN).json({status: 'error', message: `${err.message}`})
        } 
    }

    @Delete('/delete/:id')
    async deleteArea (@Res() res: Response, @Param() params: any) : Promise<any> {
        try {
            const result = await this.areaService.deleteArea(params.id)

            return res.status(HttpStatus.OK).json({status: 'success', message: 'Đã xóa khu vực thành công', data: result})
        }
        catch (err) {
            return res.status(HttpStatus.FORBIDDEN).json({status: 'error', message: `${err.message}`})
        }
    }
}
