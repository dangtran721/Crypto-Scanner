import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateScanJobDto {
  @ApiProperty()
  @IsNumber()
  scanRuleId: number;

  @ApiProperty()
  @IsNumber()
  watchlistId: number;
}
