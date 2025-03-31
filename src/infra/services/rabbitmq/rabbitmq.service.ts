import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { exchangeList } from './config/channels';
import { IPublishMessage } from './dto/publish-message.dto';
import { IExchange } from './dto/exchange.dto';

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private channel: amqp.Channel;
  private connection: amqp.Connection;
  private readonly url: string;
  private localQueue: {
    exchange: string;
    routingKey: string;
    message: any;
  }[] = [];

  constructor(private readonly configService: ConfigService) {
    this.url = this.configService.get<string>('RABBITMQ_URL');
  }

  async onModuleInit() {
    await this.connectWithRetry();
  }

  async onModuleDestroy() {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }

  async publishMessage(msg: IPublishMessage) {
    try {
      this.channel.publish(msg.exchange, msg.routingKey, msg.message, {
        persistent: true,
      });
    } catch (error) {
      this.localQueue.push(msg);

      console.log(
        `Mensagem armazenada localmente. Tamanho da fila local: ${this.localQueue.length}`,
      );
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

      exchangeList.forEach(async (ex) => {
        await this.createExchange(ex);
      });

      this.processLocalQueue();
    } catch (error) {
      console.error(`Erro ao conectar ao RabbitMQ: ${error.message}`);
      if (attempt < maxRetries) {
        console.log(`Tentando reconectar em ${retryInterval / 1000}s...`);
        setTimeout(
          () => this.connectWithRetry(retryInterval, maxRetries, attempt + 1),
          retryInterval,
        );
      } else {
        console.error(
          'Número máximo de tentativas de reconexão atingido. Abortando...',
        );
      }
    }
  }

  private async createExchange(exchange: IExchange) {
    try {
      await this.channel.assertExchange(exchange.name, exchange.type, {
        durable: exchange.durable,
      });

      console.log(
        `Conexão com RabbitMQ estabelecida. Exchange "${exchange.name}" configurada.`,
      );
    } catch (error) {
      console.error(
        `Erro ao criar a exchange "${exchange.name}": ${error.message}`,
      );
    }
  }

  private async reconnect(retryInterval: number) {
    if (this.channel) await this.channel.close().catch(() => null);
    if (this.connection) await this.connection.close().catch(() => null);

    setTimeout(() => this.connectWithRetry(retryInterval), retryInterval);
  }

  private async processLocalQueue() {
    while (this.localQueue.length > 0) {
      const { exchange, routingKey, message } = this.localQueue.shift();
      try {
        await this.publishMessage({
          exchange,
          routingKey,
          message,
        });

        if (!this.localQueue.length) {
          console.log(
            'Todas as mensagens armazenadas localmente foram enfileiradas',
          );
        }
      } catch (error) {
        console.error(
          'Erro ao processar mensagem da fila local:',
          error.message,
        );

        this.localQueue.unshift({ exchange, routingKey, message });
        break;
      }
    }
  }
}
