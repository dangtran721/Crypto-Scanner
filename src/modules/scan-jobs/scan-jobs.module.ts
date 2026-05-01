import { Module } from '@nestjs/common';
import { ScanJobsService } from './scan-jobs.service';
import { ScanJobsController } from './scan-jobs.controller';
import { ScannerService } from './scanner.service';
import { IndicatorModule } from '../indicator/indicator.module';
import { MarketDataModule } from '../market-data/market-data.module';

@Module({
  controllers: [ScanJobsController],
  providers: [ScanJobsService, ScannerService],
  imports: [IndicatorModule, MarketDataModule],
})
export class ScanJobsModule {}
