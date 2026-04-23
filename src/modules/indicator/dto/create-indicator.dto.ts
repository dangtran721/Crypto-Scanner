import { IndicatorType } from '@prisma/client';
import { IsEnum, IsObject } from 'class-validator';

export class CreateIndicatorDto {
  @IsEnum(IndicatorType)
  type: IndicatorType;

  @IsObject()
  config: any;
}
