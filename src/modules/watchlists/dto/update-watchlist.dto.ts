import { PartialType } from '@nestjs/mapped-types';
import { CreateWatchlistDto } from './create-watchlist.dto';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWatchlistDto extends PartialType(CreateWatchlistDto) {
  @ApiProperty({ example: `Top Coins - ${Math.floor(Math.random() * 1000)}` })
  @IsString()
  name?: string;
}
