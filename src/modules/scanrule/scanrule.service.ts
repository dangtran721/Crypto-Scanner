import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateScanruleDto } from './dto/create-scanrule.dto';
import { UpdateScanruleDto } from './dto/update-scanrule.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ScanRule } from '@prisma/client';
import { scanRuleConfig } from './config/scanrule-config';

@Injectable()
export class ScanruleService {
  constructor(private prisma: PrismaService) {}

  extractIndicatorIds(data: any) {
    const ids: number[] = [];
    if (data.type === 'condition') {
      if (data.left?.type === 'indicator') ids.push(data.left.indicatorId);
      if (data.right?.type === 'indicator') ids.push(data.right.indicatorId);
    }

    return ids;
  }

  async validateScanRule(logic: any, userId: number) {
    try {
      const parsed = scanRuleConfig.parse(logic);

      const indicatorIds = [...new Set(this.extractIndicatorIds(parsed))];

      const indicator = await this.prisma.indicator.findMany({
        where: { id: { in: indicatorIds }, userId },
      });

      if (indicatorIds.length != indicator.length) {
        throw new BadRequestException('Invalid indicator ownership');
      }

      return parsed;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Invalid config for scanRule');
    }
  }

  async create(dto: CreateScanruleDto, userId: number): Promise<ScanRule> {
    await this.validateScanRule(dto.logic, userId);
    return await this.prisma.scanRule.create({
      data: { ...dto, userId },
    });
  }

  findAll(userId: number): Promise<ScanRule[]> {
    return this.prisma.scanRule.findMany({ where: { userId } });
  }

  async findOne(id: number, userId: number): Promise<ScanRule> {
    const scanRule = await this.prisma.scanRule.findFirst({
      where: { id, userId },
    });

    if (!scanRule) {
      throw new NotFoundException(`Rule not found `);
    }
    return scanRule;
  }

  async update(
    id: number,
    dto: UpdateScanruleDto,
    userId: number,
  ): Promise<ScanRule> {
    const existing = await this.findOne(id, userId);

    const logic = dto.logic ?? existing.logic;

    await this.validateScanRule(logic, userId);

    return await this.prisma.scanRule.update({
      where: { id, userId },
      data: { logic },
    });
  }

  async remove(id: number, userId: number): Promise<void> {
    await this.findOne(id, userId);

    await this.prisma.scanRule.deleteMany({
      where: { id, userId },
    });
  }
}
