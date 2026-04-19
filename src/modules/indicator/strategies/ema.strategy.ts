import { Injectable } from '@nestjs/common';
import { IIndicatorStrategy } from './interface.strategy';
import { IndicatorConfigMap } from '../types/indicator-config.type';
import { IndicatorType } from '@prisma/client';

type EmaConfig = IndicatorConfigMap['EMA'];

@Injectable()
export class EmaStrategy implements IIndicatorStrategy<EmaConfig, number[]> {
  getType(): IndicatorType {
    return IndicatorType.EMA;
  }
  calculate(data: number[], config: EmaConfig): number[] {
    const { period } = config;

    if (!data.length || period <= 0) return [];

    const k = 2 / (period + 1);
    const ema: number[] = [];

    const firstSlice = data.slice(0, period);
    const sma = firstSlice.reduce((sum, price) => sum + price, 0) / period;

    ema[period - 1] = sma;

    for (let i = period; i < data.length; i++) {
      ema[i] = data[i] * k + ema[i - 1] * (1 - k);
    }

    return ema;
  }
}
