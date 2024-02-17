import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { Menu } from 'entities/menu.entity';
import { Category } from 'entities/category.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Menu, Category])],
    controllers: [MenuController],
    providers: [MenuService],
    exports: [MenuService, TypeOrmModule] //Optional, to share instance of menuservice for other modules to use
})
export class MenuModule {}
