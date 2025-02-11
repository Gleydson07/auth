import { Module } from '@nestjs/common';
import { AddressesController } from './addresses.controller';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { PrismaAddressRepository } from '@/infra/database/Prisma/repositories/prisma-address.repository';
import { AddressRepository } from '@/app/repositories/address.repository';
import { CreateAddressUseCase } from './usecases/create-address.usecase';
import { FindAllAddressesUseCase } from './usecases/find-all-address.usecase';
import { FindByIdAddressUseCase } from './usecases/find-by-id-address.usecase';
import { UpdateAddressUseCase } from './usecases/update-address.usecase';
import { RemoveAddressUseCase } from './usecases/remove-address.usecase';

@Module({
  imports: [UsersModule],
  controllers: [AddressesController],
  providers: [
    JwtService,
    CreateAddressUseCase,
    FindAllAddressesUseCase,
    FindByIdAddressUseCase,
    UpdateAddressUseCase,
    RemoveAddressUseCase,
    {
      provide: AddressRepository,
      useClass: PrismaAddressRepository,
    },
  ],
})
export class AddressesModule {}
