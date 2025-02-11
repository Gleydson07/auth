import { ProfileRepository } from '@/app/repositories/profile.repository';
import { UserRepository } from '@/app/repositories/user.repository';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(
    userId: number,
    userIdFromToken: number,
    updateProfile: UpdateProfileDto,
  ) {
    try {
      await this.userRepository.checkIsUserAdminOrSameId({
        userId: userId,
        userIdFromToken: userIdFromToken,
        messageError: 'Não é permitido alterar o perfil de terceiros.',
      });

      const profileFound = await this.profileRepository.findOne(userId);

      if (!profileFound) {
        throw new Error('Perfil não encontrado.');
      }

      const birthDay = updateProfile?.birthDay
        ? new Date(updateProfile?.birthDay)
        : undefined;

      return this.profileRepository.update(userId, {
        birthDay,
        gender: updateProfile?.gender,
        phone: updateProfile?.phone,
        document: updateProfile?.document,
        documentType: updateProfile?.documentType,
      });
    } catch (error) {
      throw new HttpException(
        error?.message ?? 'Falha ao alterar perfil!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
