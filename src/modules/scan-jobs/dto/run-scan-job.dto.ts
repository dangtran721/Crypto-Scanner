import { IsIn, IsString } from 'class-validator';

export class RunScanJobDto {
  @IsString()
  @IsIn(['mock', 'binance'])
  type: 'mock' | 'binance';
}
