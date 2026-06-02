import { Module } from '@nestjs/common';
import { ScanGateway } from './scan.gateway';
import { ScanEventsService } from './scan-events.service';

@Module({
  providers: [ScanGateway, ScanEventsService],
  exports: [ScanEventsService],
})
export class RealtimeModule {}
