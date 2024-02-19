import { Module } from '@nestjs/common';
import { TableController } from './table.controller';
import { TableService } from './table.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Table } from '../entities/table.entity';
import { Area } from 'src/entities/area.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Table, Area])], //forFeature method to determine which repository is registered in the current scope
    controllers: [TableController],
    providers: [TableService],
    exports: [TableService, TypeOrmModule]
})
export class TableModule {}
