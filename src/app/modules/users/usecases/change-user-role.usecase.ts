import { RoleEnum } from '@prisma/client';
import { UserFromToken } from '../../auth/dto/token-payload.dto';
import { UserRepository } from '@/app/repositories/user.repository';
import { UserRole } from '../dto/create-role.dto';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class ChangeUserRoleUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(user: UserFromToken, role: RoleEnum, userId: number) {
    try {
      const roleSanitized = role.trim().toUpperCase() as UserRole;
      const isValidRole = Object.values(RoleEnum).includes(roleSanitized);
      if (!isValidRole) {
        throw new Error('Role inválida.');
      }

      const userToUpdateRole = await this.userRepository.findOneById(userId);

      if (!userToUpdateRole) {
        throw new Error('Usuário não encontrado.');
      }

      if (Number(user.sub) === Number(userId)) {
        throw new Error('Você não pode alterar seu nível de acesso.');
      }

      await this.userRepository.checkIsUserAdminOrSameId({
        userId: userId,
        userIdFromToken: user.sub,
        messageError: 'Não é permitido alterar o cadastro de terceiros.',
      });

      await this.userRepository.update(userId, {
        role: roleSanitized as UserRole,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
