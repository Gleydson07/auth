import { UserRepository } from '@/app/repositories/user.repository';
import { UserFromToken } from '../../auth/dto/token-payload.dto';
import { AddressRepository } from '@/app/repositories/address.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class FindAllAddressesUseCase {
  constructor(
    private readonly addressRepository: AddressRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: number, user: UserFromToken) {
    try {
      if (!userId) {
        throw new Error('Id do usuário não informado.');
      }

      await this.userRepository.checkIsUserAdminOrSameId({
        userId: +userId,
        userIdFromToken: user.sub,
        messageError: 'Usuário sem autorização para consultar endereços.',
      });

      return await this.addressRepository.findAll(userId);
    } catch (error) {
      throw new HttpException(
        error?.message || 'Falha ao consultar endereços!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
