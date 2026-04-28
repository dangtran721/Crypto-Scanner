import { Module } from '@nestjs/common';
import { MarketDataService } from './market-data.service';
import { MarketDataController } from './market-data.controller';
import { MockProvider } from './provider/mock.provider';

@Module({
  controllers: [MarketDataController],
  providers: [MarketDataService, MockProvider],
  exports: [MarketDataService],
})
export class MarketDataModule {}
