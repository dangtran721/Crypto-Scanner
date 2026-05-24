import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateScanJobDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  scanRuleId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  watchlistId: number;
}
