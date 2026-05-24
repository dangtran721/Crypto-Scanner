import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

export class AddManyWatchlistItemsDto {
  @ApiProperty({
    type: [String],
    example: ['ETH', 'bnbusdt'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  coinSymbol: string[];
}
