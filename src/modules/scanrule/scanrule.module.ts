import { Module } from '@nestjs/common';
import { ScanruleService } from './scanrule.service';
import { ScanruleController } from './scanrule.controller';

@Module({
  controllers: [ScanruleController],
  providers: [ScanruleService],
})
export class ScanruleModule {}
