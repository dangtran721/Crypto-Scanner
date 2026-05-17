import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ScanJobsService } from './scan-jobs.service';
import { CreateScanJobDto } from './dto/create-scan-job.dto';
import { GetUser } from 'src/common/decorators';
import { AuthJwtGuard } from '../auth/guards';
import { ScannerService } from './scanner.service';
import { RunScanJobDto } from './dto/run-scan-job.dto';

@UseGuards(AuthJwtGuard)
@Controller('scan-jobs')
export class ScanJobsController {
  constructor(
    private readonly scanJobsService: ScanJobsService,
    private readonly scannerService: ScannerService,
  ) {}

  @Post()
  create(@Body() dto: CreateScanJobDto, @GetUser('id') userId: number) {
    return this.scanJobsService.create(dto, userId);
  }

  @Get()
  findAll(@GetUser('id') userId: number) {
    return this.scanJobsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('id') userId: number) {
    return this.scanJobsService.findOne(+id, userId);
  }

  //Scanner:
  @Post(':id/run')
  runJob(
    @Param('id') scanJobId: string,
    @Body() body: RunScanJobDto,
    @GetUser('id') userId: number,
  ) {
    return this.scannerService.runJob(body.type, +scanJobId, userId);
  }

  @Get(':id/results')
  findResult(@Param('id') id: string, @GetUser('id') userId: number) {
    return this.scannerService.findAllResultsById(+id, userId);
  }
}
