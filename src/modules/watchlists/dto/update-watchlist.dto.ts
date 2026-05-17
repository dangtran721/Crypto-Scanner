import { PartialType } from '@nestjs/mapped-types';
import { CreateWatchlistDto } from './create-watchlist.dto';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWatchlistDto extends PartialType(CreateWatchlistDto) {
  @ApiProperty()
  @IsString()
  name?: string;
}
