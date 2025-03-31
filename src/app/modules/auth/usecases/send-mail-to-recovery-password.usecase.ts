import { ProvisionalPasswordRepository } from '@/app/repositories/provisional-password.repository';
import { UserRepository } from '@/app/repositories/user.repository';
import { exRecoveryPassword } from '@/infra/services/rabbitmq/config/channels';
import { IPublishMessage } from '@/infra/services/rabbitmq/dto/publish-message.dto';
import { RabbitmqService } from '@/infra/services/rabbitmq/rabbitmq.service';
import { generateProvisionalPasswordHash } from '@/utils/functions/generateProvisionalPasswordHash';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SendMailToRecoveryPasswordUseCase {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly provisionalPasswordRepository: ProvisionalPasswordRepository,
    // private readonly rabbitmqService: RabbitmqService,
  ) {}

  async execute(email: string) {
    try {
      const user = await this.userRepository.findOneByEmail({
        email,
        active: true,
      });

      if (!user) {
        throw new HttpException(
          'Usuário não localizado.',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!user?.active) {
        throw new HttpException(
          'Não é possível recuperar a senha de usuários inativos.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const mailReplacements = {
        user: `${user.name} ${user.lastname.split(' ')[0]}`,
        hashProvisional: generateProvisionalPasswordHash(12),
        recoveryPasswordLink: this.configService.get<string>('MAIL_REDIRECT'),
        companyName: this.configService.get<string>('MAIL_APP_NAME'),
        headerImage: this.configService.get<string>('MAIL_HEADER_IMAGE'),
      };

      await this.provisionalPasswordRepository.generateProvisionalPassword(
        user.id,
        mailReplacements.hashProvisional,
      );

      const publishMessage: IPublishMessage = {
        exchange: exRecoveryPassword.name,
        routingKey: exRecoveryPassword.routingKey.email,
        message: Buffer.from(
          JSON.stringify({
            senderId: user.id,
            title: 'Recuperação de Senha',
            content: {
              ...mailReplacements,
              recipients: user?.email,
            },
          }),
        ),
      };

      // this.rabbitmqService.publishMessage(publishMessage);
    } catch (error) {
      throw new HttpException(
        error?.message || 'Falha ao solicitar email de recuperação de senha!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
