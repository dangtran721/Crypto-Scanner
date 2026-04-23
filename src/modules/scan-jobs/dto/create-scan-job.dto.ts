import { Status } from '@prisma/client';
import { IsNumber } from 'class-validator';

export class CreateScanJobDto {
  @IsNumber()
  scanRuleId: number;

  @IsNumber()
  watchlistId: number;
}
