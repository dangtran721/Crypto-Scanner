import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateScanJobDto } from './dto/create-scan-job.dto';
import { UpdateScanJobDto } from './dto/update-scan-job.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ScanJob, Status } from '@prisma/client';

@Injectable()
export class ScanJobsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateScanJobDto, userId: number): Promise<ScanJob> {
    const { watchlistId, scanRuleId } = dto;

    return this.prisma.$transaction(async (tx) => {
      const [watchlist, scanRule] = await Promise.all([
        tx.watchlist.findFirst({
          where: { id: watchlistId, userId },
        }),
        tx.scanRule.findFirst({
          where: { id: scanRuleId, userId },
        }),
      ]);

      if (!watchlist) {
        throw new NotFoundException('Watchlist not found');
      }

      if (!scanRule) {
        throw new NotFoundException('ScanRule not found');
      }

      return tx.scanJob.create({
        data: { watchlistId, scanRuleId, status: Status.PENDING, userId },
      });
    });
  }

  async findAll(userId: number) {
    return await this.prisma.scanJob.findMany({ where: { userId } });
  }

  async findOne(id: number, userId: number) {
    const scanJob = await this.prisma.scanJob.findFirst({
      where: { id, userId },
    });

    if (!scanJob) {
      throw new NotFoundException(`Job not found `);
    }

    return scanJob;
  }

  update(id: number, dto: UpdateScanJobDto) {
    return `This action updates a #${id} scanJob`;
  }

  remove(id: number) {
    return `This action removes a #${id} scanJob`;
  }
}
