import { PartialType } from '@nestjs/mapped-types';
import { CreateIndicatorDto } from './create-indicator.dto';
import { IndicatorType } from '@prisma/client';
import { IsEnum, IsObject } from 'class-validator';

export class UpdateIndicatorDto extends PartialType(CreateIndicatorDto) {}
