import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { UserRepository } from '@/app/repositories/user.repository';
import { ProfileRepository } from '@/app/repositories/profile.repository';

@Injectable()
export class CreateProfileUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(
    userId: number,
    userIdFromToken: number,
    createProfile: CreateProfileDto,
  ) {
    try {
      if (!userId) {
        throw new Error('Id do usuário não informado.');
      }

      await this.userRepository.checkIsUserAdminOrSameId({
        userId: userId,
        userIdFromToken: userIdFromToken,
        messageError: 'Usuário sem autorização para cadastrar perfil.',
      });

      const profileFound = await this.profileRepository.findOne(userId);

      if (profileFound) {
        throw new Error('Usuário já possui um perfil vinculado.');
      }

      return await this.profileRepository.create(userId, {
        birthDay: createProfile.birthDay
          ? new Date(createProfile?.birthDay)
          : undefined,
        gender: createProfile?.gender,
        phone: createProfile?.phone,
        document: createProfile.document,
        documentType: createProfile.documentType,
      });
    } catch (error) {
      throw new HttpException(
        error?.message || 'Falha ao cadastrar perfil!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
