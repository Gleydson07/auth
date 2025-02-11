import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { AuthModule } from './app/modules/auth/auth.module';
import { DatabaseModule } from './infra/database/database.module';
import { BlackListModule } from './app/modules/black-list/black-list.module';
import { ProfilesModule } from './app/modules/profiles/profiles.module';
import { AddressesModule } from './app/modules/addresses/addresses.module';
import { MailerModule } from './infra/services/mailer/mailer.module';
import { ScheduledTasksModule } from './infra/services/scheduled-tasks/scheduled-tasks.module';
import { join } from 'path';
import { RabbitmqModule } from './infra/services/rabbitmq/rabbitmq.module';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { UsersModule } from './app/modules/users/users.module';
import { AuthGuard } from './app/modules/auth/guards/auth.guard';
import { GraphQLThrottlerGuard } from './app/modules/auth/guards/graphql-throttler.guard';
import { ProvisionalPasswordModule } from './app/modules/provisional-password/provisional-password.module';

const env = dotenv.config();
dotenvExpand.expand(env);

export const prefix = 'ms-auth/api/v1';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [() => env.parsed],
    }),
    ThrottlerModule.forRoot({
      errorMessage: 'Número máximo de requisições atingido.',
      throttlers: [
        {
          name: 'short',
          ttl: 10000,
          limit: 5,
          blockDuration: 60000,
        },
        {
          name: 'medium',
          ttl: 30000,
          limit: 20,
          blockDuration: 120000,
        },
        {
          name: 'long',
          ttl: 120000,
          limit: 50,
          blockDuration: 600000,
        },
      ],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'graphQL/schema.gql'),
      path: `${prefix}/graphql`,
      sortSchema: true,
      playground: true,
      debug: true,
    }),
    ScheduleModule.forRoot(),
    RabbitmqModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    BlackListModule,
    ProfilesModule,
    ProvisionalPasswordModule,
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
        ],
      },
      { path: `${prefix}/system/rabbitmq`, module: RabbitmqModule },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: GraphQLThrottlerGuard,
    },
  ],
})
export class AppModule {}
