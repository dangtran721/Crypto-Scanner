import { BadGatewayException, Injectable } from '@nestjs/common';
import { IMarketDataProvider } from '../market-data.interface';
import { Candle } from 'src/common/types';
import { normalizeSymbol } from '../utils/normalize-symbol';
import { TimeFramesType } from 'src/modules/scanrule/types';
import { MarketDataType } from '../types/provider.type';
import { RedisService } from 'src/modules/redis/redis.service';

@Injectable()
export class BinanceProvider implements IMarketDataProvider {
  async getCandles(
    type: MarketDataType,
    symbol: string,
    timeFrames: TimeFramesType,
  ): Promise<Candle[]> {
    const url = new URL('https://api.binance.com/api/v3/klines');
    url.searchParams.set('symbol', normalizeSymbol(symbol));
    url.searchParams.set('interval', timeFrames);
    url.searchParams.set('limit', '200');

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new BadGatewayException(
        `Binance request failed with status ${response.status}`,
      );
    }

    const raw = await response.json();

    const candles = raw.map((k: any) => ({
      time: Number(k[0]),
      open: Number(k[1]),
      high: Number(k[2]),
      low: Number(k[3]),
      close: Number(k[4]),
      volume: Number(k[5]),
    }));
    return candles;
  }
}
