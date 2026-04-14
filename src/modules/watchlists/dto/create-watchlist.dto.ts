import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWatchlistDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
