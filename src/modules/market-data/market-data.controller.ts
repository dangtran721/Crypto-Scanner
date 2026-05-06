import { Controller } from '@nestjs/common';
import { MarketDataService } from './market-data.service';

@Controller('market-data')
export class MarketDataController {
  constructor(private readonly marketDataService: MarketDataService) {}

  // @Post()
  // create(@Body() createMarketDatumDto: CreateMarketDatumDto) {
  //   return this.marketDataService.create(createMarketDatumDto);
  // }
}
