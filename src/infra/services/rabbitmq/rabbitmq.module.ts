import { Module } from '@nestjs/common';
import { RabbitmqService } from "./rabbitmq.service";
import { RabbitmqController } from "./rabbitmq.controller";
import { UsersModule } from "@/users/users.module";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [UsersModule],
  providers: [JwtService, RabbitmqService],
  exports: [RabbitmqService],
  controllers: [RabbitmqController],
})
export class RabbitmqModule {}
