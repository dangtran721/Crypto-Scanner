import { Module } from '@nestjs/common';
import { IndicatorService } from './indicator.service';
import { IndicatorController } from './indicator.controller';
import {
  EmaStrategy,
  IchimokuStrategy,
  RsiStrategy,
  StrategiesMap,
} from './strategies';

@Module({
  controllers: [IndicatorController],
  providers: [
    IndicatorService,
    StrategiesMap,
    EmaStrategy,
    RsiStrategy,
    IchimokuStrategy,
  ],
  exports: [StrategiesMap],
})
export class IndicatorModule {}
