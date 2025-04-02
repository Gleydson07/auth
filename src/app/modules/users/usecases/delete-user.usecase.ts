import { UserRepository } from '@/app/repositories/user.repository';
import { exUser } from '@/infra/services/rabbitmq/config/channels';
import { IPublishMessage } from '@/infra/services/rabbitmq/dto/publish-message.dto';
import { RabbitmqService } from '@/infra/services/rabbitmq/rabbitmq.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  async execute(id: number) {
    try {
      const userToUpdateRole = await this.userRepository.findOneById(+id);

      if (!userToUpdateRole) {
        throw new Error('Usuário não encontrado.');
      }

      await this.userRepository.remove(id);

      const publishMessage: IPublishMessage = {
        exchange: exUser.name,
        routingKey: exUser.routingKey.removed,
        message: Buffer.from(
          JSON.stringify({
            senderId: id,
            title: 'Remoção de Usuário',
            content: {
              id: userToUpdateRole.id,
              name: userToUpdateRole.name,
              lastname: userToUpdateRole.lastname,
              email: userToUpdateRole.email,
              active: userToUpdateRole.active,
            },
          }),
        ),
      };

      this.rabbitmqService.publishMessage(publishMessage);
    } catch (error) {
      throw new HttpException(
        error.message || 'Falha ao remover usuário.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
