import { ScanEvaluationResult } from './scan-evaluation.type';

export type ScanResultItemType = {
  coinSymbol: string;
  result: ScanEvaluationResult;
  isValidSetup: boolean;
};
