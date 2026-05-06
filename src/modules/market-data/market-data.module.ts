import { Module } from '@nestjs/common';
import { MarketDataService } from './market-data.service';
import { MarketDataController } from './market-data.controller';
import { MockProvider } from './provider/mock.provider';
import { IMarketDataProvider } from './market-data.interface';
import { BinanceProvider } from './provider/binance.provider';
import { MarketDataProviderMap } from './provider/provider-map';

@Module({
  controllers: [MarketDataController],
  providers: [
    MarketDataService,
    MockProvider,
    BinanceProvider,
    MarketDataProviderMap,
  ],
  exports: [MarketDataService],
})
export class MarketDataModule {}
