export class IPublishMessage {
  exchange: string;
  routingKey: string;
  message: Buffer;
}
