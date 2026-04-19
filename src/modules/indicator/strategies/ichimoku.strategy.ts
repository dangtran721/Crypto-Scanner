import { Injectable } from '@nestjs/common';
import { IndicatorConfigMap } from '../types/indicator-config.type';
import { IIndicatorStrategy } from './interface.strategy';
import { IchimokuCloud } from 'technicalindicators';
import { IndicatorType } from '@prisma/client';
import { Candle } from '../types/candle.type';

type IchimokuConfig = IndicatorConfigMap['ICHIMOKU'];

type IchimokuCloudOutput = {
  conversion?: number;
  base?: number;
  spanA?: number;
  spanB?: number;
};
@Injectable()
export class IchimokuStrategy implements IIndicatorStrategy<
  IchimokuConfig,
  IchimokuCloudOutput[]
> {
  getType(): IndicatorType {
    return IndicatorType.ICHIMOKU;
  }
  calculate(candles: Candle[], config: IchimokuConfig): IchimokuCloudOutput[] {
    const highPrice = candles.map((h) => h.high);
    const lowPrice = candles.map((l) => l.low);
    return IchimokuCloud.calculate({
      high: highPrice,
      low: lowPrice,
      conversionPeriod: config.tenkan,
      basePeriod: config.kijun,
      spanPeriod: config.senkou,
      displacement: config.kijun,
    });
  }
}
