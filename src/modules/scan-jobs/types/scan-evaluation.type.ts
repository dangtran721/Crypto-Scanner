import { ScanOperator } from 'src/modules/scanrule/types';
import { IndicatorValue } from './indicator-value.type';

export type ScanEvaluationResult = {
  left: IndicatorValue;
  right: IndicatorValue;
  operator: ScanOperator;
};
