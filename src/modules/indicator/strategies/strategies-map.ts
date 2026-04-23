import { IndicatorType } from '@prisma/client';
import { EmaStrategy, IchimokuStrategy, RsiStrategy } from '.';
import { Injectable } from '@nestjs/common';
import { IIndicatorStrategy } from './interface.strategy';

@Injectable()
// To avoid to the service able to get larger
export class StrategiesMap {
  private strategyMap: Partial<Record<IndicatorType, IIndicatorStrategy>> = {};

  constructor(
    private ema: EmaStrategy,
    private rsi: RsiStrategy,
    private ichimoku: IchimokuStrategy,
  ) {
    const strategies = [this.ema, this.rsi, this.ichimoku];

    for (const strategy of strategies) {
      this.strategyMap[strategy.getType()] = strategy;
    }
  }
  getStrategy(type: IndicatorType): IIndicatorStrategy | undefined {
    return this.strategyMap[type];
  }
}
