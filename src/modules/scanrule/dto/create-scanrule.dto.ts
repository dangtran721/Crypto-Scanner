import { IsObject } from 'class-validator';
import type { ScanCondition } from '../types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScanruleDto {
  @ApiProperty({
    example: {
      userId: 1,
      logic: {
        type: 'condition',
        timeFrames: '1d',
        operator: 'cross_above',
        left: { type: 'indicator', indicatorId: 1 },
        right: { type: 'indicator', indicatorId: 2 },
      },
    },
  })
  @IsObject()
  logic: ScanCondition;
}
