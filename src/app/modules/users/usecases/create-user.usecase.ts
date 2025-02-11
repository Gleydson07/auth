import * as bcrypt from 'bcrypt';
import { SALT, UserRepository } from '@/app/repositories/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: CreateUserDto) {
    try {
      const userAlreadyExists = await this.userRepository.findOneByEmail({
        email: data.email,
      });

      if (userAlreadyExists) {
        throw new Error('Usuário já existe.');
      }

      const hash = await bcrypt.hash(data.password, SALT);

      const result = await this.userRepository.create({
        name: data.name,
        lastname: data.lastname,
        email: data.email.trim().toLowerCase(),
        password: hash,
      });

      const { active, ...response } = result;

      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
