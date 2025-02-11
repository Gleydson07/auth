import { UserRepository } from '@/app/repositories/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number, active?: boolean) {
    return this.userRepository.findOneById(id, active);
  }
}
