import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class RunScanJobDto {
  @ApiProperty({ example: 'binance' })
  @IsString()
  @IsIn(['mock', 'binance'])
  type: 'mock' | 'binance';
}
