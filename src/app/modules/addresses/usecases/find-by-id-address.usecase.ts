import { AddressRepository } from '@/app/repositories/address.repository';
import { UserFromToken } from '../../auth/dto/token-payload.dto';
import { UserRepository } from '@/app/repositories/user.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class FindByIdAddressUseCase {
  constructor(
    private readonly addressRepository: AddressRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: number, addressId: number, user: UserFromToken) {
    try {
      if (!userId) {
        throw new Error('Id do usuário não informado.');
      }

      if (!addressId) {
        throw new Error('Id do endereço não informado.');
      }

      await this.userRepository.checkIsUserAdminOrSameId({
        userId: +userId,
        userIdFromToken: user.sub,
        messageError: 'Usuário sem autorização para consultar endereço.',
      });

      return await this.addressRepository.findOne(userId, addressId);
    } catch (error) {
      throw new HttpException(
        error?.message || 'Falha ao consultar endereço!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
