import { Module } from '@nestjs/common';
import { MenuModule } from './menu/menu.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TableModule } from './table/table.module';
import { AreaModule } from './area/area.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PrinterController } from './printer/printer.controller';
import { PrinterModule } from './printer/printer.module';
import { CategoryModule } from './category/category.module';
import { PromotionModule } from './promotion/promotion.module';
import { APP_FILTER } from '@nestjs/core';
import { NotFoundFilter } from 'filter/notfound.filter';

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
    autoLoadEntities: true, //If true, entities will be automatically loaded, default is false, Any entities registered via the forFeature() method will automatically be added to the entities array of the configuration object.
    synchronize: true, //If in production mode, set it to false, otherwise data will be lost. Use this in development mode
    retryAttempts: 5, //Number of attempts to connect to the database, default is 10
    retryDelay: 3000, //Delay between reconnection attempts (ms), default is 3000
  }), PrinterModule, CategoryModule, PromotionModule],
  controllers: [AppController, PrinterController], 
  providers: [AppService, {
    provide: APP_FILTER,
    useClass: NotFoundFilter //Handle exception not found by own way
  }],
})

export class AppModule {
  constructor(private dataSource: DataSource){}
}
