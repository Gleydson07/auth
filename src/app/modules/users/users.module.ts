import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserGraphqlService } from './graphQL/user.gql.service';
import { UserGraphqlResolver } from './graphQL/user.gql.resolver';

@Module({
  imports: [ConfigModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    JwtService,
    UserGraphqlResolver,
    UserGraphqlService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
