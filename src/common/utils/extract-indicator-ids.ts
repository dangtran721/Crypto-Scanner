import { ScanCondition } from 'src/modules/scanrule/types';

export const extractIndicatorIds = (logic: ScanCondition) => {
  const ids: number[] = [];
  if (logic.type === 'condition') {
    if (logic.left?.type === 'indicator') ids.push(logic.left.indicatorId);
    if (logic.right?.type === 'indicator') ids.push(logic.right.indicatorId);
  }

  return ids;
};
