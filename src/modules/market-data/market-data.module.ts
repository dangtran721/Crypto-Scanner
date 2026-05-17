import { Module } from '@nestjs/common';
import { MarketDataService } from './market-data.service';
import { MockProvider } from './provider/mock.provider';
import { BinanceProvider } from './provider/binance.provider';
import { MarketDataProviderMap } from './provider/provider-map';
import { RedisModule } from '../redis/redis.module';

@Module({
  providers: [
    MarketDataService,
    MockProvider,
    BinanceProvider,
    MarketDataProviderMap,
  ],
  imports: [RedisModule],
  exports: [MarketDataService],
})
export class MarketDataModule {}
