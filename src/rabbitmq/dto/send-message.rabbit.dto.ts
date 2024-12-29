export class SendMessageRabbitDTO {
  exchange: string;
  routineKey?: string;
  message: any;
}
