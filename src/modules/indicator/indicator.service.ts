import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateIndicatorDto } from './dto/create-indicator.dto';
import { UpdateIndicatorDto } from './dto/update-indicator.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Indicator, IndicatorType } from '@prisma/client';
import { IIndicatorStrategy } from './strategies/interface.strategy';
import { indicatorConfigMap } from './config/indicator-config';

@Injectable()
export class IndicatorService {
  private strategyMap: Partial<Record<IndicatorType, IIndicatorStrategy>>;
  constructor(
    private prisma: PrismaService,
    private readonly strategies: IIndicatorStrategy[],
  ) {
    for (const strategy of strategies) {
      this.strategyMap[strategy.getType()] = strategy;
    }
  }

  validateIndicator(dto: CreateIndicatorDto): void {
    const schema = indicatorConfigMap[dto.type];
    if (!schema) {
      throw new BadRequestException('Unsupported indicator type');
    }
    schema.parse(dto.config);

    const strategy = this.strategyMap[dto.type];
    if (!strategy) {
      throw new BadRequestException('Strategy not found');
    }
  }

  async create(dto: CreateIndicatorDto, userId: number): Promise<Indicator> {
    this.validateIndicator(dto);
    return await this.prisma.indicator.create({ data: { ...dto, userId } });
  }

  async findAll(userId: number): Promise<Indicator[]> {
    return await this.prisma.indicator.findMany({ where: { userId } });
  }

  async findOne(id: number, userId: number): Promise<Indicator> {
    const indicator = await this.prisma.indicator.findFirst({
      where: { id, userId },
    });

    if (!indicator) {
      throw new NotFoundException(`Indicator not found `);
    }
    return indicator;
  }

  async update(
    id: number,
    dto: UpdateIndicatorDto,
    userId: number,
  ): Promise<Indicator> {
    await this.findOne(id, userId);
    return await this.prisma.indicator.update({
      where: { id, userId },
      data: { ...dto },
    });
  }

  async remove(id: number, userId: number): Promise<void> {
    await this.findOne(id, userId);
    await this.prisma.indicator.deleteMany({ where: { id, userId } });
  }
}
