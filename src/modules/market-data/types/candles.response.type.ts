import { Candle } from 'src/common/types';

export type CandleResponse = {
  provider: string;
  fallback: boolean;
  message?: string;
  data: Candle[];
};
