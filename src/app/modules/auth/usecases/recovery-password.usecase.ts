import { SALT, UserRepository } from '@/app/repositories/user.repository';
import { RecoveryPasswordDto } from '../dto/recovery-password.dto';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ProvisionalPasswordRepository } from '@/app/repositories/provisional-password.repository';

@Injectable()
export class RecoveryPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly provisionalPasswordRepository: ProvisionalPasswordRepository,
  ) {}

  async execute(data: RecoveryPasswordDto) {
    try {
      const { email, password, provisionalPassword } = data;

      const provPassword =
        await this.provisionalPasswordRepository.findPasswordAndProvisionalPasswordByEmail(
          email,
        );

      if (!provPassword) {
        throw new Error(
          'Solicite uma nova senha provisória para concluir a recuperação de senha.',
        );
      }

      const isMatch = await bcrypt.compare(
        provisionalPassword,
        provPassword?.provisionalPassword,
      );

      if (!isMatch) {
        throw new Error('A senha provisória é incompatível.');
      }

      const hash = await bcrypt.hash(password, SALT);
      await this.userRepository.updatePassword(provPassword.user.email, hash);
      this.provisionalPasswordRepository.updateManyProvisionalPasswordByUserId(
        provPassword.user.id,
        { active: false },
      );
    } catch (error) {
      throw new HttpException(
        error?.message || 'Falha ao gerar nova senha!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
