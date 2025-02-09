import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserGraphqlService } from './graphQL/user.gql.service';
import { UserGraphqlResolver } from './graphQL/user.gql.resolver';
import { ChangeUserActiveStatusUseCase } from './usecases/change-user-active-status.usecase';
import { PrismaUserRepository } from '@/infra/database/repositories/prisma-user.repository';
import { UserRepository } from '@/app/repositories/user.repository';

@Module({
  imports: [ConfigModule],
  controllers: [UsersController],
  providers: [
    JwtService,
    UserGraphqlResolver,
    UserGraphqlService,
    ChangeUserActiveStatusUseCase,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UserRepository],
})
export class UsersModule {}
