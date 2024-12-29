import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService  } from "@nestjs/config";
import { ScheduleModule } from '@nestjs/schedule';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { RouterModule } from "@nestjs/core";
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { DatabaseModule } from "./database/database.module";
import { BlackListModule } from './auth/black-list/black-list.module';
import { ProfilesModule } from './profiles/profiles.module';
import { AddressesModule } from "./addresses/addresses.module";
import { MailerModule } from './mailer/mailer.module';
import { ScheduledTasksModule } from './scheduled-tasks/scheduled-tasks.module';
import { join } from "path";

export const prefix = 'ms-auth/api/v1'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      context: ({ req }) => ({ req }),
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'graphQL/schema.gql'),
      path: `${prefix}/graphql`,
      sortSchema: true,
      playground: true,
      debug: true,
    }),
    ClientsModule.registerAsync([{
      name: "RabbitMQ",
      imports: [],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        name: configService.get<string>('APP_NAME'),
        transport: Transport.RMQ,
        options: {
          urls: [configService.get<string>('RABBITMQ_URL')],
          queueOptions: {
            arguments: {
              'x-message-ttl': configService.get<number>('RABBITMQ_TTL_MSGS'), // TTL de mensagens (60 segundos)
              'x-dead-letter-exchange': configService.get<string>('RABBITMQ_EXCHANGE_EXPIRED_MSGS'), // Exchange para mensagens expiradas
            }
          },
          exchange: configService.get<string>('RABBITMQ_EXCHANGE_NAME'),
          exchangeType: configService.get<string>('RABBITMQ_EXCHANGE_TYPE'), // 'fanout', 'direct', 'topic', 'headers'
        }
      })
    }]),
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthModule,
    UsersModule,
    BlackListModule,
    ProfilesModule,
    AddressesModule,
    MailerModule,
    ScheduledTasksModule,
    RouterModule.register([
      { path: `${prefix}/auth`, module: AuthModule },
      {
        path: `${prefix}/users`,
        module: UsersModule,
        children: [
          { path: `/:id/profiles`, module: ProfilesModule },
          { path: `/:id/addresses`, module: AddressesModule },
        ]
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule { }
