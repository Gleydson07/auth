import { UserFromToken } from '../../auth/dto/token-payload.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { AddressRepository } from '@/app/repositories/address.repository';
import { UserRepository } from '@/app/repositories/user.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class UpdateAddressUseCase {
  constructor(
    private readonly addressRepository: AddressRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(
    user: UserFromToken,
    userId: number,
    addressId: number,
    updateAddress: UpdateAddressDto,
  ) {
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
        messageError: 'Usuário sem autorização para atualizar endereço.',
      });

      const addressFound = await this.addressRepository.findOne(
        userId,
        addressId,
      );

      if (!addressFound) {
        throw new Error('Endereço não encontrado.');
      }

      return await this.addressRepository.update(
        userId,
        addressId,
        updateAddress,
      );
    } catch (error) {
      throw new HttpException(
        error?.message || 'Falha ao atualizar endereço!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
