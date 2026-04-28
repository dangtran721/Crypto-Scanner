import { Controller, Post, UseGuards, Param } from '@nestjs/common';
import { ScannerService } from './scanner.service';
import { GetUser } from 'src/common/decorators';
import { AuthJwtGuard } from '../auth/guards';

@UseGuards(AuthJwtGuard)
@Controller('scan-jobs')
export class ScannerController {
  constructor(private readonly scannerService: ScannerService) {}

  @Post(':id/run')
  runJob(@Param('id') scanJobId: string, @GetUser('id') userId: number) {
    return this.scannerService.runJob(+scanJobId, userId);
  }
}
