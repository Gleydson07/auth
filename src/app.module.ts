import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RouterModule } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule } from "@nestjs/config";
import { BlackListModule } from './auth/black-list/black-list.module';
import { ProfilesModule } from './profiles/profiles.module';
import { AddressesModule } from "./addresses/addresses.module";

export const prefix = 'ms-auth/api/v1'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    BlackListModule,
    ProfilesModule,
    AddressesModule,
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
  providers: [AppService],
})
export class AppModule { }
