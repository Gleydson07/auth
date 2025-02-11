import { ProfileRepository } from '@/app/repositories/profile.repository';
import { UserRepository } from '@/app/repositories/user.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class RemoveProfileUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(userId: number, userIdFromToken: number) {
    try {
      await this.userRepository.checkIsUserAdminOrSameId({
        userId: userId,
        userIdFromToken: userIdFromToken,
        messageError: 'Não é permitido remover o perfil de terceiros.',
      });

      const profileFound = await this.profileRepository.findOne(userId);

      if (!profileFound) {
        throw new Error('Perfil não encontrado.');
      }

      await this.profileRepository.remove(userId);
    } catch (error) {
      throw new HttpException(
        error.message || 'Falha ao remover perfil!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
