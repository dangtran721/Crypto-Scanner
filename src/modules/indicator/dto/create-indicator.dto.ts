import { ApiProperty } from '@nestjs/swagger';
import { IndicatorType } from '@prisma/client';
import { IsEnum, IsObject } from 'class-validator';

export class CreateIndicatorDto {
  @ApiProperty({ enum: IndicatorType })
  @IsEnum(IndicatorType)
  type: IndicatorType;

  @ApiProperty()
  @IsObject()
  config: any;
}
