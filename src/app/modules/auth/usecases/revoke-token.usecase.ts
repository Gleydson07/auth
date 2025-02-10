import { BlackListRepository } from '@/app/repositories/black-list.repository';
import { UserFromToken } from '../dto/token-payload.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

export class RevokeTokenUseCase {
  constructor(private blackListRepository: BlackListRepository) {}

  async execute(token: string, args: string, user: UserFromToken) {
    try {
      const tokenAlreadyExists = await this.blackListRepository.exists(token);

      if (tokenAlreadyExists) {
        throw new HttpException(
          'O token informado já está revogado!',
          HttpStatus.BAD_REQUEST,
        );
      }

      return this.blackListRepository.create({
        token,
        args,
        revokedByUserId: user.sub,
      });
    } catch (error) {
      throw new HttpException(
        error?.message ?? 'Falha revogar token!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
