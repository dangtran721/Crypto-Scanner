import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ScanJobsService } from './scan-jobs.service';
import { CreateScanJobDto } from './dto/create-scan-job.dto';
import { UpdateScanJobDto } from './dto/update-scan-job.dto';
import { GetUser } from 'src/common/decorators';
import { AuthJwtGuard } from '../auth/guards';

@UseGuards(AuthJwtGuard)
@Controller('scan-jobs')
export class ScanJobsController {
  constructor(private readonly scanJobsService: ScanJobsService) {}

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateScanJobDto) {
    return this.scanJobsService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scanJobsService.remove(+id);
  }
}
