import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConfigModule } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { BlackListService } from "@/auth/black-list/black-list.service";
import { UserGraphqlService } from "./graphQL/users/user.gql.service";
import { UserGraphqlResolver } from "./graphQL/users/user.gql.resolver";

@Module({
  imports: [ConfigModule,],
  controllers: [UsersController],
  providers: [
    UsersService,
    JwtService,
    BlackListService,
    UserGraphqlResolver,
    UserGraphqlService
  ],
  exports: [UsersService]
})
export class UsersModule { }
