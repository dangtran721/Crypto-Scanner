import { IndicatorValue } from './indicator-value.type';

export type ScanResultItemType = {
  coinSymbol: string;
  result: {
    left: IndicatorValue;
    right: IndicatorValue;
    operator: string;
  };
  isValidSetup: boolean;
};
