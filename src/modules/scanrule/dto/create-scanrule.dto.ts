import { IsObject } from 'class-validator';
import type { ScanCondition } from '../types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScanruleDto {
  @ApiProperty()
  @IsObject()
  logic: ScanCondition;
}
