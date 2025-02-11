import { ProfileRepository } from '@/app/repositories/profile.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindByUserIdProfileUseCase {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async execute(userId: number) {
    return await this.profileRepository.findOne(userId);
  }
}
