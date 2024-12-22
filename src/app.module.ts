import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RouterModule } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { DatabaseModule } from "./database/database.module";
import { BlackListModule } from './auth/black-list/black-list.module';
import { ProfilesModule } from './profiles/profiles.module';
import { AddressesModule } from "./addresses/addresses.module";
import { MailerModule } from './mailer/mailer.module';
import { ScheduledTasksModule } from './scheduled-tasks/scheduled-tasks.module';
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
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
