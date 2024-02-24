import { Controller, All, Res, HttpStatus, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  // @All('/*')
  // catchNotOK(@Res() res) {
  //   return res.status(HttpStatus.NOT_OK).json({ status: 'error', message: 'Không tìm thấy đường dẫn'})
  // }
}
