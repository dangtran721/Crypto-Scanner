import { Module } from '@nestjs/common';
import { ScannerService } from './scanner.service';
import { ScannerController } from './scanner.controller';
import { IndicatorModule } from '../indicator/indicator.module';
import { MarketDataModule } from '../market-data/market-data.module';

@Module({
  controllers: [ScannerController],
  providers: [ScannerService],
  imports: [IndicatorModule, MarketDataModule],
})
export class ScannerModule {}
