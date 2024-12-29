import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService  } from "@nestjs/config";
import { RabbitmqService } from "./rabbitmq.service";

@Module({
  imports: [
    ClientsModule.registerAsync([{
      name: "RabbitMQ",
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        name: configService.get<string>('APP_NAME'),
        transport: Transport.RMQ,
        options: {
          urls: [configService.get<string>('RABBITMQ_URL')],
          queueOptions: {
            arguments: {
              'x-message-ttl': +configService.get<number>('RABBITMQ_TTL_MSGS'), // TTL de mensagens(60 segundos)
              'x-dead-letter-exchange': configService.get<string>('RABBITMQ_EXCHANGE_EXPIRED_MSGS'), // Exchange para mensagens expiradas
            }
          },
          exchange: configService.get<string>('RABBITMQ_EXCHANGE_NAME'),
          exchangeType: configService.get<string>('RABBITMQ_EXCHANGE_TYPE'), // 'fanout', 'direct', 'topic', 'headers'
        }
      })
    }]),
  ],
  providers: [RabbitmqService],
  exports: [RabbitmqService, ClientsModule]
})
export class RabbitmqModule {}
