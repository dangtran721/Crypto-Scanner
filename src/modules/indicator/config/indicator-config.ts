import { IndicatorType } from '@prisma/client';
import { z } from 'zod';
export const schemaMap = {
  [IndicatorType.EMA]: z.object({
    period: z.number().min(1).max(200),
  }),

[IndicatorType.RSI]: z.object({
    period: z.number().min(1).max(200),
  }),

[IndicatorType.ICHIMOKU]: z.object({
    tenkan: z.number().min(1).max(200),
    kijun: z.number().min(1).max(200),
    senkou: z.number().min(1).max(200),
  }),
};
