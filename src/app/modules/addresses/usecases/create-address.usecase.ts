import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserFromToken } from '../../auth/dto/token-payload.dto';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UserRepository } from '@/app/repositories/user.repository';
import { AddressRepository } from '@/app/repositories/address.repository';

@Injectable()
export class CreateAddressUseCase {
  constructor(
    private readonly addressRepository: AddressRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(
    userId: number,
    user: UserFromToken,
    createAddress: CreateAddressDto,
  ) {
    try {
      if (!userId) {
        throw new Error('Id do usuário não informado.');
      }

      await this.userRepository.checkIsUserAdminOrSameId({
        userId: +userId,
        userIdFromToken: user.sub,
        messageError: 'Usuário sem autorização para cadastrar endereço.',
      });

      return await this.addressRepository.create(+userId, {
        neighborhood: createAddress.neighborhood,
        street: createAddress?.street,
        number: createAddress?.number,
        city: createAddress.city,
        country: createAddress.country,
        zipCode: createAddress.zipCode,
      });
    } catch (error) {
      throw new HttpException(
        error?.message || 'Falha ao cadastrar endereço!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
