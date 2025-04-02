import { IExchange } from '../dto/exchange.dto';

export const exRecoveryPassword: IExchange = {
  name: 'ex_auth_recovery_password',
  type: 'direct',
  durable: true,
  routingKey: {
    email: 'email',
    sms: 'sms',
  },
};

export const exUser: IExchange = {
  name: 'ex_auth_user',
  type: 'topic',
  durable: true,
  routingKey: {
    created: 'user.created',
    removed: 'user.removed',
  },
};

export const exchangeList: IExchange[] = [exRecoveryPassword, exUser];
