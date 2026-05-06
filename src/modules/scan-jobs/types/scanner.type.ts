import { MarketDataType } from 'src/modules/market-data/types/provider.type';
import { ScanEvaluationResult } from './scan-evaluation.type';

export type ScanResultItemType = {
  type: MarketDataType;
  coinSymbol: string;
  result: ScanEvaluationResult;
  isValidSetup: boolean;
};
