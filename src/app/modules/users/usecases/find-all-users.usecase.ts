import { UserRepository } from '@/app/repositories/user.repository';

export class FindAllUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(active?: boolean) {
    return this.userRepository.findAll(active);
  }
}
