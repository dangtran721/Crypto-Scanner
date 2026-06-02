import { MarketTick } from './market-tick-type';

export interface MarketStreamProvider {
  start(symbols: string[]): void;
  stop(): void;
  onTick(handler: (tick: MarketTick) => void): void;
}
