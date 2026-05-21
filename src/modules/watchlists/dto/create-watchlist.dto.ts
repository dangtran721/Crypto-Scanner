import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWatchlistDto {
  @ApiProperty({ example: 'Top Coins' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
