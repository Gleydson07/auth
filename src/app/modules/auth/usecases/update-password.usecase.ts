import * as bcrypt from 'bcrypt';
import { UserRepository } from '@/app/repositories/user.repository';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class UpdatePasswordUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(data: UpdatePasswordDto, email: string) {
    try {
      const { currentPassword, password } = data;
      const user = await this.userRepository.findOneByEmail({
        email,
        active: true,
      });

      if (!user) {
        throw new HttpException(
          'Náo foi possível identificar o usuário.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        throw new HttpException('Dados incompatíveis.', HttpStatus.BAD_REQUEST);
      }

      await this.userRepository.updatePassword(email, password);
    } catch (error) {
      throw new HttpException(
        error.message || 'Falha ao atualizar password.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
