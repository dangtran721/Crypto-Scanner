import { PartialType } from '@nestjs/mapped-types';
import { CreateIndicatorDto } from './create-indicator.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsObject } from 'class-validator';
import { IndicatorType } from '@prisma/client';

export class UpdateIndicatorDto extends PartialType(CreateIndicatorDto) {
  @ApiProperty({ example: 'EMA' })
  @IsEnum(IndicatorType)
  type: IndicatorType;

  @ApiProperty({ example: { period: Math.floor(Math.random() * 200) } })
  @IsObject()
  config: any;
}
