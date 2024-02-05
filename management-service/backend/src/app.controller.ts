import { Controller, All, Res, HttpStatus, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  // @All()
  // catchNotFound(@Res() res) {
  //   return res.status(HttpStatus.NOT_FOUND).json({ status: 'error', message: 'url not found'})
  // }
}
