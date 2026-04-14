import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class AddWatchlistItemDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z0-9]+$/, {
    message: 'coinSymbol must be uppercase alphanumeric (e.g., BTCUSDT)',
  })
  coinSymbol: string;
}
