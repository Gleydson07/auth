import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import * as amqp from 'amqplib';
import { SendMessageRabbitDTO } from "./dto/send-message.rabbit.dto";

@Injectable()
export class RabbitmqService implements OnModuleInit {
  private channel: amqp.Channel;
  private connection: amqp.Connection;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const RABBITMQ_URL = this.configService.get<string>('RABBITMQ_URL');
    const EXCHANGE_NAME = this.configService.get<string>('RABBITMQ_EXCHANGE_NAME');
    const EXCHANGE_TYPE = this.configService.get<string>('RABBITMQ_EXCHANGE_TYPE');

    const exchanges = [{
      name: EXCHANGE_NAME,
      type: EXCHANGE_TYPE,
      durable: true
    }]

    this.connection = await amqp.connect(RABBITMQ_URL);
    this.channel = await this.connection.createChannel();

    await Promise.all(exchanges.map((ex) => {
      return this.channel.assertExchange(ex.name, ex.type, { durable: ex.durable });
    }));

    console.table(exchanges);
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }

  async publishMessage({ exchange, routineKey, message }: SendMessageRabbitDTO) {
    try {
      const messageBuffer = Buffer.from(JSON.stringify(message));

      this.channel.publish(exchange, routineKey, messageBuffer, {
        persistent: true,
      });

    } catch (error) {
      console.error('Error publishing message:', error);
      throw error.message;
    }
  }
}
