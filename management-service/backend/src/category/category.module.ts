import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category } from 'src/entities/category.entity';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';

@Module({
    imports: [TypeOrmModule.forFeature([Category])],
    controllers: [CategoryController],
    providers: [CategoryService, RabbitmqService],
    exports: [CategoryService, TypeOrmModule]
})
export class CategoryModule {}
