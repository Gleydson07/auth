import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserGraphqlService } from './graphQL/user.gql.service';
import { UserGraphqlResolver } from './graphQL/user.gql.resolver';
import { ChangeUserActiveStatusUseCase } from './usecases/change-user-active-status.usecase';
import { PrismaUserRepository } from '@/infra/database/Prisma/repositories/prisma-user.repository';
import { UserRepository } from '@/app/repositories/user.repository';
import { ChangeUserRoleUseCase } from './usecases/change-user-role.usecase';
import { CreateUserUseCase } from './usecases/create-user.usecase';
import { DeleteUserUseCase } from './usecases/delete-user.usecase';
import { FindAllUsersUseCase } from './usecases/find-all-users.usecase';
import { FindUserByIdUseCase } from './usecases/find-by-id-user.usecase';
import { UpdateUserUseCase } from './usecases/update-user.usecase';

@Module({
  imports: [ConfigModule],
  controllers: [UsersController],
  providers: [
    JwtService,
    UserGraphqlResolver,
    UserGraphqlService,
    ChangeUserActiveStatusUseCase,
    ChangeUserRoleUseCase,
    CreateUserUseCase,
    DeleteUserUseCase,
    FindAllUsersUseCase,
    FindUserByIdUseCase,
    UpdateUserUseCase,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UserRepository],
})
export class UsersModule {}
