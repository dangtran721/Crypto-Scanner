import { MarketDataType } from 'src/modules/market-data/types';

export type MarketTick = {
  provider: MarketDataType;
  symbol: string;
  price: number;
  timestamp: number;
};
