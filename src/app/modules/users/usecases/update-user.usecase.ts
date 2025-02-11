import { UserRepository } from '@/app/repositories/user.repository';
import { UserFromToken } from '../../auth/dto/token-payload.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(user: UserFromToken, id: number, updateUserDto: UpdateUserDto) {
    try {
      await this.userRepository.checkIsUserAdminOrSameId({
        userId: id,
        userIdFromToken: user.sub,
        messageError: 'Não é permitido alterar o cadastro de terceiros.',
      });

      await this.userRepository.update(id, updateUserDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Falha ao atualizar dados do usuário.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
