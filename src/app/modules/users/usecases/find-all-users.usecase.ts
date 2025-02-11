import { UserRepository } from '@/app/repositories/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindAllUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(active?: boolean) {
    return this.userRepository.findAll(active);
  }
}
