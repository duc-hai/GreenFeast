import { Module } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';

@Module({
  providers: [RabbitmqService],
  exports: [RabbitmqService, RabbitmqModule]
})
export class RabbitmqModule {}
