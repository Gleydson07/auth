import * as bcrypt from 'bcrypt';
import { SALT, UserRepository } from '@/app/repositories/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IPublishMessage } from '@/infra/services/rabbitmq/dto/publish-message.dto';
import { exUser } from '@/infra/services/rabbitmq/config/channels';
// import { RabbitmqService } from '@/infra/services/rabbitmq/rabbitmq.service';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    // private readonly rabbitmqService: RabbitmqService,
  ) {}

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

      const publishMessage: IPublishMessage = {
        exchange: exUser.name,
        routingKey: exUser.routingKey.email,
        message: Buffer.from(
          JSON.stringify({
            senderId: result.id,
            title: 'Criação de Usuário',
            content: response,
          }),
        ),
      };

      // this.rabbitmqService.publishMessage(publishMessage);

      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
