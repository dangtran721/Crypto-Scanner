import { Module } from '@nestjs/common';
import { MarketDataService } from './market-data.service';
import { MarketDataController } from './market-data.controller';
import { MockProvider } from './provider/mock.provider';
import { IMarketDataProvider } from './market-data.interface';
import { BinanceProvider } from './provider/binance.provider';
import { MarketDataProviderMap } from './provider/provider-map';
import { RedisService } from '../redis/redis.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  controllers: [MarketDataController],
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
