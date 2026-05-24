import { IndicatorType } from '@prisma/client';
import { z } from 'zod';
export const indicatorConfigMap = {
  [IndicatorType.EMA]: z.object({
    period: z.number().min(1).max(201),
  }),

  [IndicatorType.RSI]: z.object({
    period: z.number().min(1).max(201),
  }),

  [IndicatorType.ICHIMOKU]: z.object({
    tenkan: z.number().min(1).max(201),
    kijun: z.number().min(1).max(201),
    senkou: z.number().min(1).max(201),
  }),
};
