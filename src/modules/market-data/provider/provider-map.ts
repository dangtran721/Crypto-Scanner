import { BadRequestException, Injectable } from '@nestjs/common';
import { IMarketDataProvider } from '../market-data.interface';
import { MockProvider } from './mock.provider';
import { BinanceProvider } from './binance.provider';
import { MarketDataType } from '../types/provider.type';

@Injectable()
export class MarketDataProviderMap {
  private providerMap = new Map<MarketDataType, IMarketDataProvider>();

  constructor(
    private mockProvider: MockProvider,
    private binanceProvider: BinanceProvider,
  ) {
    this.providerMap = new Map();

    this.providerMap.set('mock', this.mockProvider);
    this.providerMap.set('binance', this.binanceProvider);
  }

  getType(type: MarketDataType) {
    const provider = this.providerMap.get(type);
    if (!provider) {
      throw new BadRequestException(`Unsupported provider ${type} type`);
    }
    return provider;
  }
}
