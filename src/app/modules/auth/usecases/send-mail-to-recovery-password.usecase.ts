import { ProvisionalPasswordRepository } from '@/app/repositories/provisional-password.repository';
import { UserRepository } from '@/app/repositories/user.repository';
import { SendMailDto } from '@/infra/services/mailer/dto/send-mail.dto';
import { MailerService } from '@/infra/services/mailer/mailer.service';
import { templateRecoveryPassword } from '@/infra/services/mailer/templates/recovery-password';
import { templateFormatter } from '@/infra/services/mailer/utils/replacer';
import { RabbitmqService } from '@/infra/services/rabbitmq/rabbitmq.service';
import { generateProvisionalPasswordHash } from '@/utils/functions/generateProvisionalPasswordHash';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class SendMailToRecoveryPasswordUseCase {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
    private readonly provisionalPasswordRepository: ProvisionalPasswordRepository,
    private readonly mailerService: MailerService,
    private readonly rabbitmqService: RabbitmqService,
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

      if (this.configService.get<boolean>('MAIL_SEND_FROM_QUEUE')) {
        this.rabbitmqService.publishMessage({
          routingKey: 'email',
          message: {
            ...mailReplacements,
            recipients: user?.email,
          },
        });
      } else {
        const userSender = this.configService.get<string>(
          'MAIL_DEFAULT_SENDER',
        );
        const mailProps: SendMailDto = {
          from: `"${mailReplacements.companyName}" <${userSender}>`,
          recipients: user.email,
          subject: 'Recuperação de senha',
          text: '/nOlá!/n Siga as orientações abaixo para recuperar sua senha:',
          html: mailReplacements
            ? templateFormatter(templateRecoveryPassword, mailReplacements)
            : templateRecoveryPassword,
        };

        this.mailerService.sendMail(mailProps);
      }
    } catch (error) {
      throw new HttpException(
        error?.message || 'Falha ao solicitar email de recuperação de senha!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
