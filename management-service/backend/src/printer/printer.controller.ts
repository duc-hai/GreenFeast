import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { PrinterService } from './printer.service';
import { Response } from 'express';
import { CreatePrinterDto } from './dto/create-printer.dto';
import { create } from 'domain';
import { UpdatePrinterDto } from './dto/update-printer.dto';

@Controller('printer')
export class PrinterController {
    constructor(private printerService: PrinterService) {}

    @Get('/get-all')
    async findAll(@Res() res: Response): Promise<any> {
        try {
            const result = await this.printerService.getAllPrinter()

            return res.status(HttpStatus.FOUND).json({status: 'success', message: 'Lấy danh sách thành công', data: result})
        }
        catch (err) {
            return res.status(HttpStatus.FORBIDDEN).json({status: 'error', message: `${err.message}`})
        }
    }

    @Post('/create')
    async createPrinterConnection(@Res() res: Response, @Body() createPrinterDto: CreatePrinterDto): Promise<any> {
        try {
            const result = await this.printerService.createPrinterConnection(createPrinterDto)

            return res.status(HttpStatus.FOUND).json({status: 'success', message: 'Thêm máy in thành công', data: result})
        }
        catch (err) {
            return res.status(HttpStatus.FORBIDDEN).json({status: 'error', message: `${err.message}`})
        }
    }

    @Get('/get-printer-type')
    async getPrinterType(@Res() res: Response): Promise<any> {
        try {
            const result = await this.printerService.getPrinterType()

            return res.status(HttpStatus.FOUND).json({status: 'success', message: 'Thành công', data: result})
        }
        catch (err) {
            return res.status(HttpStatus.FORBIDDEN).json({status: 'error', message: `${err.message}`})
        }
    }

    @Put('/update/:id')
    async updatePrinter(@Res() res: Response, @Body() updatePrinterDto: UpdatePrinterDto, @Param() param: any): Promise<any> {
        try {
            const result = await this.printerService.updatePrinter(updatePrinterDto, param.id)

            return res.status(HttpStatus.FOUND).json({status: 'success', message: 'Cập nhật máy in thành công', data: result})

        }
        catch (err) {
            return res.status(HttpStatus.FORBIDDEN).json({status: 'error', message: `${err.message}`})
        }
    }

    @Delete('/delete/:id')
    async removePrinter (@Res() res: Response, @Param() param: any): Promise<any> {
        try {
            await this.printerService.removePrinter(param.id)

            return res.status(HttpStatus.FOUND).json({status: 'success', message: 'Đã xóa máy in thành công'})
        }
        catch (err) {
            return res.status(HttpStatus.FORBIDDEN).json({status: 'error', message: `${err.message}`})
        }
    }
}
