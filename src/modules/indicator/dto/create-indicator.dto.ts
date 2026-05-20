import { ApiProperty } from '@nestjs/swagger';
import { IndicatorType } from '@prisma/client';
import { IsEnum, IsObject } from 'class-validator';

export class CreateIndicatorDto {
  @ApiProperty({ example: 'EMA' })
  @IsEnum(IndicatorType)
  type: IndicatorType;

  @ApiProperty({ example: {} })
  @IsObject()
  config: any;
}
