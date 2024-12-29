import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from "@nestjs/config";
import { lastValueFrom } from "rxjs";
import * as amqp from 'amqplib';
import { SendMessageRabbitDTO } from "./dto/send-message.rabbit.dto";

@Injectable()
export class RabbitmqService implements OnModuleInit {
  constructor(
    @Inject('RabbitMQ') private readonly client: ClientProxy,
    private readonly configService: ConfigService
) {}

  async onModuleInit() {
    const RABBITMQ_URL = this.configService.get<string>('RABBITMQ_URL');
    const EXCHANGE_NAME = this.configService.get<string>('RABBITMQ_EXCHANGE_NAME');
    const EXCHANGE_TYPE = this.configService.get<string>('RABBITMQ_EXCHANGE_TYPE');

    const exchanges = [{
      name: EXCHANGE_NAME,
      type: EXCHANGE_TYPE,
      durable: true
    }]

    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await Promise.all(exchanges.map((ex) => {
      return channel.assertExchange(ex.name, ex.type, { durable: ex.durable });
    }))

    console.table(exchanges);
    await channel.close();
    await connection.close();
  }

  async publishMessage({ exchange, routineKey, message }: SendMessageRabbitDTO) {
    try {
      const request = this.client.emit({ exchange, routineKey }, message);
      await lastValueFrom(request);

      console.log(`Message published to exchange "${exchange}".`);
    } catch (error) {
      console.error('Error publishing message:', error);
      throw error.message;
    }
  }
}
