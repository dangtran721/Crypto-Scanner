import { Injectable, OnModuleInit } from '@nestjs/common';
import { ScanEventsService } from '../realtime/scan-events.service';
import { MarketStreamService } from './market-stream.service';

@Injectable()
export class MarketStreamBridge implements OnModuleInit {
  constructor(
    private readonly marketStream: MarketStreamService,
    private readonly scanEvents: ScanEventsService,
  ) {}

  onModuleInit() {
    this.marketStream.onTick((tick) => {
      this.scanEvents.priceTick(1, {
        provider: tick.provider,
        symbol: tick.symbol,
        price: tick.price,
        updatedAt: new Date(tick.timestamp).toISOString(),
      });
    });
  }
}
