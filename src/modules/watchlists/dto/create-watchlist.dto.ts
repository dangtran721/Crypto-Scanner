import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWatchlistDto {
  @ApiProperty({ example: 'Test Watchlist' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
