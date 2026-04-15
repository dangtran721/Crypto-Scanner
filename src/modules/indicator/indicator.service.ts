import { Injectable } from '@nestjs/common';
import { CreateIndicatorDto } from './dto/create-indicator.dto';
import { UpdateIndicatorDto } from './dto/update-indicator.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmaStrategy } from './strategies';
import { IndicatorType } from '@prisma/client';
import { IIndicatorStrategy } from './strategies/interface.strategy';

@Injectable()
export class IndicatorService {
  private strategyMap: Partial<Record<IndicatorType, IIndicatorStrategy>>;
  constructor(
    private prisma: PrismaService,
    private emaStrategy: EmaStrategy,
  ) {
    this.strategyMap = {
      [IndicatorType.EMA]: this.emaStrategy,
    };
  }

  async create(dto: CreateIndicatorDto, userId: number) {
    return await this.prisma.indicator.create({ data: { ...dto, userId } });
  }

  findAll() {
    return `This action returns all indicator`;
  }

  findOne(id: number) {
    return `This action returns a #${id} indicator`;
  }

  update(id: number, updateIndicatorDto: UpdateIndicatorDto) {
    return `This action updates a #${id} indicator`;
  }

  remove(id: number) {
    return `This action removes a #${id} indicator`;
  }
}
