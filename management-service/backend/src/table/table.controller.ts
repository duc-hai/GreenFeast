import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus, Res, Query } from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto';
import { TableService } from './table.service';
import { Response } from 'express';
import { CreateTableAutoDto } from './dto/create-tables-auto.dto';
import { DeleteTablesDto } from './dto/delete-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';

@Controller('table')
export class TableController {
    constructor(private tableService: TableService) {}
    //Path: GET: /table/get-tables
    //Des: Get table list by id area
    @Get('/get-tables')
    async findAllTables (@Query('area_id') id, @Res() res : Response): Promise<any> {
        try {
            const result = await this.tableService.getTablesByArea(id);
            
            return res.status(HttpStatus.FOUND).json({status: 'success', message: 'Lấy danh sách thành công', data: result})
        }
        catch (err) {
            return res.status(HttpStatus.FORBIDDEN).json({status: 'error', message: `${err.message}`})
        }
    }

    @Post('/create')
    async createTable (@Res() res: Response, @Body() createTableDto: CreateTableDto) {
        try {
            const result = await this.tableService.createTable(createTableDto);

            return res.status(HttpStatus.FOUND).json({status: 'success', message: 'Đã thêm bàn thành công', data: result})
        }
        catch (err) {
            return res.status(HttpStatus.FORBIDDEN).json({status: 'error', message: `${err.message}`})
        }
    }

    @Post('/create-auto')
    async createTables (@Res() res: Response, @Body() createTableAutoDto: CreateTableAutoDto) {
        try {
            const result = await this.tableService.createTablesAuto(createTableAutoDto);

            return res.status(HttpStatus.FOUND).json({status: 'success', message: 'Tạo thành công bàn tự động', data: result})
        }
        catch (err) {
            return res.status(HttpStatus.FORBIDDEN).json({status: 'error', message: `${err.message}`})
        }
    }

    @Put('/update/:id')
    async updateTable (@Res() res: Response, @Param() params: any, @Body() updateTableDto: UpdateTableDto): Promise<any> {
        try {
            const result = await this.tableService.updateTable(params.id, updateTableDto);

            return res.status(HttpStatus.FOUND).json({status: 'success', message: 'Cập nhật bàn thành công', data: result})
        }
        catch (err) {
            return res.status(HttpStatus.FORBIDDEN).json({status: 'error', message: `${err.message}`})
        } 
    }

    @Delete('/delete')
    async deleteTables (@Res() res: Response, @Body() deleteTableDto: DeleteTablesDto): Promise<any>{
        try {
            const result = await this.tableService.deleteTables(deleteTableDto)

            return res.status(HttpStatus.FOUND).json({status: 'success', message: 'Đã xóa các bàn thành công', data: result})
        }
        catch (err){
            return res.status(HttpStatus.FORBIDDEN).json({status: 'error', message: `${err.message}`})
        }
    }
}
