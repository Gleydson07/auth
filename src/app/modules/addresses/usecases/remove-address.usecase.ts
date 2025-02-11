import { AddressRepository } from '@/app/repositories/address.repository';
import { UserRepository } from '@/app/repositories/user.repository';
import { UserFromToken } from '../../auth/dto/token-payload.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class RemoveAddressUseCase {
  constructor(
    private readonly addressRepository: AddressRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(user: UserFromToken, userId: number, addressId: number) {
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
        messageError: 'Usuário sem autorização para remover endereço.',
      });

      const addressFound = await this.addressRepository.findOne(
        userId,
        addressId,
      );

      if (!addressFound) {
        throw new Error('Endereço não encontrado.');
      }

      await this.addressRepository.remove(userId, addressId);
    } catch (error) {
      throw new HttpException(
        error?.message || 'Falha ao remover endereço!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
