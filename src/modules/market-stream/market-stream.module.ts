import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MarketStreamService } from './market-stream.service';
import { MockStreamProvider } from './provider/mock-stream-provider';

@Module({
  imports: [PrismaModule],
  providers: [MarketStreamService, MockStreamProvider],
  exports: [MarketStreamService],
})
export class MarketStreamModule {}
