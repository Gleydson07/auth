import { UserRepository } from '@/app/repositories/user.repository';

export class FindUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number, active?: boolean) {
    return this.userRepository.findOneById(id, active);
  }
}
