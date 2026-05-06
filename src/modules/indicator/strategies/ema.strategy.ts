import { Injectable } from '@nestjs/common';
import { IIndicatorStrategy } from './interface.strategy';
import { IndicatorConfigMap } from '../types/indicator-config.type';
import { IndicatorType } from '@prisma/client';
import { Candle } from 'src/common/types';

type EmaConfig = IndicatorConfigMap['EMA'];

@Injectable()
export class EmaStrategy implements IIndicatorStrategy<EmaConfig, number[]> {
  getType(): IndicatorType {
    return IndicatorType.EMA;
  }
  calculate(candles: Candle[], config: EmaConfig): number[] {
    const { period } = config;

    if (!candles.length || period <= 0 || candles.length < period) return [];

    const k = 2 / (period + 1);
    const ema: number[] = [];

    const firstSlice = candles.slice(0, period);
    const sma =
      firstSlice.reduce((sum, price) => sum + price.close, 0) / period;

    ema[period - 1] = sma;

    for (let i = period; i < candles.length; i++) {
      ema[i] = candles[i].close * k + ema[i - 1] * (1 - k);
    }

    return ema.slice(period - 1);
  }
}
