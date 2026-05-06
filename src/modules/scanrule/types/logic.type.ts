import { ScanOperand, IndicatorOperand } from './operand.type';
import { ScanOperator } from './operator.type';
import { TimeFramesType } from './timeframes.type';

export type ScanCondition = {
  type: 'condition';
  timeFrames: TimeFramesType;
  operator: ScanOperator;
  left: IndicatorOperand;
  right: ScanOperand;
};
