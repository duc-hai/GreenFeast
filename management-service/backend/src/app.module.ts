import { Module } from '@nestjs/common';
import { MenuModule } from './menu/menu.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TableModule } from './table/table.module';
import { AreaModule } from './area/area.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Table } from '../entities/table.entity';
import { Area } from 'entities/area.entity';
import { PrinterController } from './printer/printer.controller';
import { PrinterModule } from './printer/printer.module';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';
import { CategoryModule } from './category/category.module';
import { PromotionModule } from './promotion/promotion.module';

@Module({
  imports: [MenuModule, TableModule, AreaModule, ConfigModule.forRoot({
    envFilePath: ['.env'], //Path to .env file
    cache: true, //Increased performance of the ConfigService#get method when accessing process.env
    // ignoreEnvFile: true, //Don't want to load the env file but just want to access it through runtime like using the terminal
    // isGlobal: true, //Allows other modules to use this .env without importing it like the app module is doing

  }), TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    //entities: [Table, Area],
    synchronize: true, //If in production mode, set it to false, otherwise data will be lost. Use this in development mode
    retryAttempts: 5, //Number of attempts to connect to the database, default is 10
    retryDelay: 3000, //Delay between reconnection attempts (ms), default is 3000
    autoLoadEntities: true //If true, entities will be automatically loaded, default is false, Any entities registered via the forFeature() method will automatically be added to the entities array of the configuration object.
  }), PrinterModule, CategoryModule, PromotionModule],
  controllers: [AppController, PrinterController, CategoryController], 
  providers: [AppService, CategoryService],
})

export class AppModule {
  constructor(private dataSource: DataSource){}
}
