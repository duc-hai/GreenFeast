import { Module } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promotion } from 'src/entities/promotion.entity';
import { Menu } from 'src/entities/menu.entity';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';

@Module({
  imports: [TypeOrmModule.forFeature([Promotion, Menu])],
  providers: [PromotionService, RabbitmqService],
  controllers: [PromotionController],
  exports: [PromotionModule, TypeOrmModule]
})
export class PromotionModule {}
