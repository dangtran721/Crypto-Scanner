import { ScanEvaluationResult } from './scan-evaluation.type';

export type ScanResultType = {
  scanRunId: number;
  coinSymbol: string;
  result: ScanEvaluationResult;
  isValidSetup: boolean;
};
