import { PartialType } from '@nestjs/mapped-types';
import { CreateWatchlistDto } from './create-watchlist.dto';
import { IsString } from 'class-validator';

export class UpdateWatchlistDto extends PartialType(CreateWatchlistDto) {
  @IsString()
  name?: string;
}
