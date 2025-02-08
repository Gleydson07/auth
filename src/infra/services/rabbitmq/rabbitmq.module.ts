import { Module } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { RabbitmqController } from './rabbitmq.controller';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '@/app/modules/users/users.module';

@Module({
  imports: [UsersModule],
  providers: [JwtService, RabbitmqService],
  exports: [RabbitmqService],
  controllers: [RabbitmqController],
})
export class RabbitmqModule {}
