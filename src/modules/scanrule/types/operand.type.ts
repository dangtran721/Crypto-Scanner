export type IndicatorOperand = {
  type: 'indicator';
  indicatorId: number;
};

export type ValueOperand = {
  type: 'value';
  value: number;
};

export type ScanOperand = IndicatorOperand | ValueOperand;
