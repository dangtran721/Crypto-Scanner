import { indicatorConfigMap } from '../config/indicator-config';
import { z } from 'zod';

export type IndicatorConfigMap = {
  [K in keyof typeof indicatorConfigMap]: z.infer<
    (typeof indicatorConfigMap)[K]
  >;
};
