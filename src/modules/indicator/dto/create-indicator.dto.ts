import { IndicatorType } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class CreateIndicatorDto {
  @IsEnum(IndicatorType)
  type: IndicatorType;
  config: Record<string, any>;
}
