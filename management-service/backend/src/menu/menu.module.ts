import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { Menu } from 'src/entities/menu.entity';
import { Category } from 'src/entities/category.entity';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';

@Module({
    imports: [TypeOrmModule.forFeature([Menu, Category])],
    controllers: [MenuController],
    providers: [MenuService, RabbitmqService],
    exports: [MenuService, TypeOrmModule] //Optional, to share instance of menuservice for other modules to use
})
export class MenuModule {}
