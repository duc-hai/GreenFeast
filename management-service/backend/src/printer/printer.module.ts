import { Module } from '@nestjs/common';
import { PrinterService } from './printer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Printer } from 'src/entities/printer.entity';
import { PrinterController } from './printer.controller';
import { Area } from 'src/entities/area.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Printer, Area])],
  controllers: [PrinterController],
  providers: [PrinterService],
  exports: [PrinterService, TypeOrmModule]
})
export class PrinterModule {}
