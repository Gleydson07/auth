import { Module } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { RabbitmqController } from './rabbitmq.controller';

@Module({
  imports: [],
  providers: [RabbitmqService],
  exports: [RabbitmqService],
  controllers: [RabbitmqController],
})
export class RabbitmqModule {}
