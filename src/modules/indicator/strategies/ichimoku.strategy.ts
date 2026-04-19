import { Injectable } from '@nestjs/common';
import { IndicatorConfigMap } from '../types/indicator-config.type';
import { IIndicatorStrategy } from './interface.strategy';
import { IchimokuCloud } from 'technicalindicators';
import { IndicatorType } from '@prisma/client';

type IchimokuConfig = IndicatorConfigMap['ICHIMOKU'];

type IchimokuCloudOutput = {
  conversion: number;
  base: number;
  spanA: number;
  spanB: number;
};
@Injectable()
export class IchimokuStrategy implements IIndicatorStrategy<
  IchimokuConfig,
  IchimokuCloudOutput[]
> {
  getType(): IndicatorType {
    return IndicatorType.ICHIMOKU;
  }
  calculate(data: number[], config: IchimokuConfig): IchimokuCloudOutput[] {
    return IchimokuCloud.calculate({
      high: data,
      low: data,
      conversionPeriod: config.tenkan,
      basePeriod: config.kijun,
      spanPeriod: config.senkou,
      displacement: config.kijun,
    });
  }
}
