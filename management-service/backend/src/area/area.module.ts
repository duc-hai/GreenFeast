import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { Area } from '../entities/area.entity';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';

@Module({
    imports: [TypeOrmModule.forFeature([Area])],
    controllers: [AreaController],
    providers: [AreaService, RabbitmqService],
    exports: [AreaService, TypeOrmModule],
})
export class AreaModule {}
