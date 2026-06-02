import { Injectable } from '@nestjs/common';
import { ScanGateway } from './scan.gateway';

@Injectable()
export class ScanEventsService {
  constructor(private readonly gateway: ScanGateway) {}

  priceTick(userId: number, payload: unknown) {
    this.gateway.emitPriceTick(userId, payload);
  }

  liveResult(userId: number, payload: unknown) {
    this.gateway.emitLiveResult(userId, payload);
  }

  signalTriggered(userId: number, payload: unknown) {
    this.gateway.emitSignalTriggered(userId, payload);
  }
}
