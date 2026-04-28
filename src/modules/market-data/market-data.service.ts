import { Injectable } from '@nestjs/common';
import { CreateMarketDatumDto } from './dto/create-market-datum.dto';
import { UpdateMarketDatumDto } from './dto/update-market-datum.dto';
import { MockProvider } from './provider/mock.provider';
import { Candle } from 'src/common/types';

@Injectable()
export class MarketDataService {
  constructor(private provider: MockProvider) {}

  getCandles(symbol: string): Promise<Candle[]> {
    return this.provider.getCandles(symbol);
  }

  create(createMarketDatumDto: CreateMarketDatumDto) {
    return 'This action adds a new marketDatum';
  }

  findAll() {
    return `This action returns all marketData`;
  }

  findOne(id: number) {
    return `This action returns a #${id} marketDatum`;
  }

  update(id: number, updateMarketDatumDto: UpdateMarketDatumDto) {
    return `This action updates a #${id} marketDatum`;
  }

  remove(id: number) {
    return `This action removes a #${id} marketDatum`;
  }
}
