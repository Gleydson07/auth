import { UserRepository } from '@/app/repositories/user.repository';
import { UserFromToken } from '../../auth/dto/token-payload.dto';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class ChangeUserActiveStatusUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(user: UserFromToken, active: boolean, userId: number) {
    try {
      const userToUpdateRole = await this.userRepository.findOneById(userId);

      if (!userToUpdateRole) {
        throw new Error('Usuário não encontrado.');
      }

      if (Number(user.sub) === Number(userId)) {
        throw new Error('Você não pode alterar seu status.');
      }

      await this.userRepository.checkIsUserAdminOrSameId({
        userId: userId,
        userIdFromToken: user.sub,
        messageError: 'Não é permitido alterar o cadastro de terceiros.',
      });

      await this.userRepository.update(userId, { active });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
