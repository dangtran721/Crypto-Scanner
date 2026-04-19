import { Module } from '@nestjs/common';
import { IndicatorService } from './indicator.service';
import { IndicatorController } from './indicator.controller';
import { EmaStrategy, IchimokuStrategy, RsiStrategy } from './strategies';

@Module({
  controllers: [IndicatorController],
  providers: [IndicatorService, EmaStrategy, RsiStrategy, IchimokuStrategy],
})
export class IndicatorModule {}
