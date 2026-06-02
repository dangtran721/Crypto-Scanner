import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { MarketStreamService } from './market-stream.service';
import { MockStreamProvider } from './provider/mock-stream-provider';
import { MarketStreamBridge } from './market-stream-bridge';

@Module({
  imports: [PrismaModule, RealtimeModule],
  providers: [MarketStreamService, MockStreamProvider, MarketStreamBridge],
  exports: [MarketStreamService],
})
export class MarketStreamModule {}
