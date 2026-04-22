import { z } from 'zod';
export const scanRuleConfig = z.object({
  type: z.literal('condition'),
  operator: z.enum(['lt', 'gt', 'cross_above', 'cross_below']),
  left: z.object({ type: z.literal('indicator'), indicatorId: z.number() }),
  right: z.union([
    z.object({ type: z.literal('indicator'), indicatorId: z.number() }),
    z.object({ type: z.literal('value'), value: z.number() }),
  ]),
});
