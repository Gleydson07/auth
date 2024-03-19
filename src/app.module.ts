import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RouterModule } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule } from "@nestjs/config";
import { BlackListModule } from './black-list/black-list.module';
import { ProfilesModule } from './profiles/profiles.module';
import { S3Module } from './s3/s3.module';
import { MulterModule } from "@nestjs/platform-express";
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
    S3Module,
    MulterModule.register({
      limits: {
        fileSize: 1024 * 1024 * 10, // 5MB limite de tamanho do arquivo
      },
    }),
    RouterModule.register([
      { path: `${prefix}/auth`, module: AuthModule },
      { path: `${prefix}/users`, module: UsersModule },
      { path: `${prefix}/profiles`, module: ProfilesModule },
    ]),
    AddressesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
