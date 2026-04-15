import { Module } from '@nestjs/common';
import { IndicatorService } from './indicator.service';
import { IndicatorController } from './indicator.controller';
import { EmaStrategy } from './strategies';

@Module({
  controllers: [IndicatorController],
  providers: [IndicatorService, EmaStrategy],
})
export class IndicatorModule {}
