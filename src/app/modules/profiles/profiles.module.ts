import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { UsersModule } from '../users/users.module';
import { PrismaProfileRepository } from '@/infra/database/Prisma/repositories/prisma-profile.repository';
import { ProfileRepository } from '@/app/repositories/profile.repository';
import { CreateProfileUseCase } from './usecases/create-profile.usecase';
import { FindByUserIdProfileUseCase } from './usecases/find-by-user-id-profile.usecase';
import { RemoveProfileUseCase } from './usecases/remove-profile.usecase';
import { UpdateProfileUseCase } from './usecases/update-profile.usecase';

@Module({
  imports: [UsersModule],
  controllers: [ProfilesController],
  providers: [
    CreateProfileUseCase,
    FindByUserIdProfileUseCase,
    RemoveProfileUseCase,
    UpdateProfileUseCase,
    {
      provide: ProfileRepository,
      useClass: PrismaProfileRepository,
    },
  ],
})
export class ProfilesModule {}
