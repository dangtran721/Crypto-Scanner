import { ScanOperand, IndicatorOperand } from './operand.type';
import { ScanOperator } from './operator.type';

export type ScanCondition = {
  type: 'condition';
  operator: ScanOperator;
  left: IndicatorOperand;
  right: ScanOperand;
};
