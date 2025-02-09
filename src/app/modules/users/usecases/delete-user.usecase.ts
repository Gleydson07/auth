import { UserRepository } from '@/app/repositories/user.repository';
import { HttpException, HttpStatus } from '@nestjs/common';

export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number) {
    try {
      const userToUpdateRole = await this.userRepository.findOneById(+id);

      if (!userToUpdateRole) {
        throw new Error('Usuário não encontrado.');
      }

      await this.userRepository.remove(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Falha ao remover usuário.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
