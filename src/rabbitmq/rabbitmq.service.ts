import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import * as amqp from 'amqplib';
import { SendMessageRabbitDTO } from "./dto/send-message.rabbit.dto";

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private channel: amqp.Channel;
  private connection: amqp.Connection;
  private readonly url: string;
  private readonly exchangeName: string;
  private readonly exchangeType: string;
  private localQueue: { routingKey: string; message: any }[] = [];

  constructor(private readonly configService: ConfigService) {
    this.url = this.configService.get<string>('RABBITMQ_URL');
    this.exchangeName = this.configService.get<string>('RABBITMQ_EXCHANGE_NAME');
    this.exchangeType = this.configService.get<string>('RABBITMQ_EXCHANGE_TYPE');
  }

  async onModuleInit() {
    await this.connectWithRetry();
  }

  async onModuleDestroy() {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }

  async publishMessage({ routingKey, message }: SendMessageRabbitDTO) {
    try {
      const messageBuffer = Buffer.from(JSON.stringify(message));
      this.channel.publish(this.exchangeName, routingKey, messageBuffer, {
        persistent: true,
      });

    } catch (error) {
      this.storeMessageLocally(routingKey, message);
      // this.connectWithRetry(null, 0);
    }
  }

  async connectWithRetry(retryInterval = 5000, maxRetries = 5, attempt = 0) {
    try {
      if (attempt) {
        console.log(`Reconectando com RabbitMQ (${attempt}/${maxRetries})...`);
      }
      this.connection = await amqp.connect(this.url);

      this.connection.on('error', (err) => {
        console.error('Erro na conexão do RabbitMQ:', err.message);
        this.reconnect(retryInterval);
      });

      this.connection.on('close', () => {
        console.warn('Conexão com RabbitMQ fechada.');
        this.reconnect(retryInterval);
      });

      this.channel = await this.connection.createChannel();
      await this.channel.assertExchange(this.exchangeName, this.exchangeType, { durable: true });

      console.log(`Conexão com RabbitMQ estabelecida. Exchange "${this.exchangeName}" configurada.`);

      this.processLocalQueue();
    } catch (error) {
      console.error(`Erro ao conectar ao RabbitMQ: ${error.message}`);
      if (attempt < maxRetries) {
        console.log(`Tentando reconectar em ${retryInterval / 1000}s...`);
        setTimeout(() => this.connectWithRetry(retryInterval, maxRetries, attempt + 1), retryInterval);
      } else {
        console.error('Número máximo de tentativas de reconexão atingido. Abortando...');
      }
    }
  }

  private async reconnect(retryInterval: number) {
    if (this.channel) await this.channel.close().catch(() => null);
    if (this.connection) await this.connection.close().catch(() => null);

    setTimeout(() => this.connectWithRetry(retryInterval), retryInterval);
  }

  private async storeMessageLocally(routingKey: string, message: any) {
    this.localQueue.push({ routingKey, message });
    console.log(`Mensagem armazenada localmente. Tamanho da fila local: ${this.localQueue.length}`);
  }

  private async processLocalQueue() {
    while (this.localQueue.length > 0) {
      const { routingKey, message } = this.localQueue.shift();
      try {
        await this.publishMessage({routingKey, message});

        console.log(`Mensagem processada da fila local: ${this.localQueue.length}.`);
      } catch (error) {
        console.error('Erro ao processar mensagem da fila local:', error.message);

        this.localQueue.unshift({ routingKey, message });
        break;
      }
    }
  }
}
