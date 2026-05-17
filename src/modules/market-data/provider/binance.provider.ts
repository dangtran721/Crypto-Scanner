import { BadGatewayException, Injectable } from '@nestjs/common';
import { IMarketDataProvider } from '../market-data.interface';
import { Candle } from 'src/common/types';
import { normalizeSymbol } from '../utils/normalize-symbol';
import { TimeFramesType } from 'src/modules/scanrule/types';
import { BinanceKline, MarketDataType } from '../types';

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

    const raw: unknown = await response.json();
    if (!Array.isArray(raw)) {
      throw new BadGatewayException('Binance response is not a kline array');
    }

    return raw.map((kline, index) => this.toCandle(kline, index));
  }

  private toCandle(kline: unknown, index: number): Candle {
    if (!Array.isArray(kline) || kline.length < 6) {
      throw new BadGatewayException(
        `Binance kline at index ${index} is malformed`,
      );
    }

    const [time, open, high, low, close, volume] = kline as BinanceKline;

    return {
      time: this.toNumber(time, 'time', index),
      open: this.toNumber(open, 'open', index),
      high: this.toNumber(high, 'high', index),
      low: this.toNumber(low, 'low', index),
      close: this.toNumber(close, 'close', index),
      volume: this.toNumber(volume, 'volume', index),
    };
  }

  private toNumber(
    value: number | string,
    field: string,
    index: number,
  ): number {
    const parsed = Number(value);

    if (Number.isNaN(parsed)) {
      throw new BadGatewayException(
        `Binance kline ${field} at index ${index} is not numeric`,
      );
    }

    return parsed;
  }
}
