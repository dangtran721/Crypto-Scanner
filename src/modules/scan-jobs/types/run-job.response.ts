import { MarketDataType } from 'src/modules/market-data/types';
import { ScanResultType } from './scan-result.type';

export type RunJobResponse = {
  providerRequested: MarketDataType;
  providerUsed: MarketDataType;
  fallback: boolean;
  message?: string;
  results: ScanResultType[];
};
