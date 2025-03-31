import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';

@Injectable()
export class EventBusService {
  private eventEmitter: EventEmitter = new EventEmitter();

  publish(event: string, payload: any): void {
    this.eventEmitter.emit(event, payload);
  }

  subscribe(event: string, callback: (payload: any) => void): void {
    this.eventEmitter.on(event, callback);
  }

  unsubscribe(event: string, callback: (payload: any) => void): void {
    this.eventEmitter.off(event, callback);
  }
}
