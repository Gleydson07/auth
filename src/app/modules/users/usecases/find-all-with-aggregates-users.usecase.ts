import { UserRepository } from '@/app/repositories/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindAllWithAggregatesUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(name?: string) {
    return this.userRepository.findAllWithAggregates(name);
  }
}
