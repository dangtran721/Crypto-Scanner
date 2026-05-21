import { ApiProperty } from '@nestjs/swagger';
import { IndicatorType } from '@prisma/client';
import { IsEnum, IsObject } from 'class-validator';

export class CreateIndicatorDto {
  @ApiProperty({ example: 'EMA' })
  @IsEnum(IndicatorType)
  type: IndicatorType;

  @ApiProperty({ example: { period: 200 } })
  @IsObject()
  config: any;
}
