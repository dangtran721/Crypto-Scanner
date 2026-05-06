import { Module } from '@nestjs/common';
import { DashBoardController } from './dashboard.controller';
import { DashBoardService } from './dashboard.service';

@Module({
  controllers: [DashBoardController],
  providers: [DashBoardService],
})
export class DashBoardModule {}
