import { Module } from '@nestjs/common';
import { PrinterService } from './printer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Printer } from 'src/entities/printer.entity';
import { PrinterController } from './printer.controller';
import { Area } from 'src/entities/area.entity';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';

@Module({
  imports: [TypeOrmModule.forFeature([Printer, Area])],
  controllers: [PrinterController],
  providers: [PrinterService, RabbitmqService],
  exports: [PrinterService, TypeOrmModule]
})
export class PrinterModule {}
