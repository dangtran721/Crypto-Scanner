import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateIndicatorDto } from './dto/create-indicator.dto';
import { UpdateIndicatorDto } from './dto/update-indicator.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Indicator } from '@prisma/client';
import { indicatorConfigMap } from './config/indicator-config';
import { StrategiesMap } from './strategies';

@Injectable()
export class IndicatorService {
  constructor(
    private prisma: PrismaService,
    private strategyMap: StrategiesMap,
  ) {}

  validateIndicator(dto: CreateIndicatorDto): void {
    const schema = indicatorConfigMap[dto.type];
    if (!schema) {
      throw new BadRequestException('Unsupported indicator type');
    }

    try {
      schema.parse(dto.config);
    } catch (error) {
      throw new BadRequestException('Invalid config for indicator');
    }

    const strategy = this.strategyMap.getStrategy(dto.type);

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
    const existing = await this.findOne(id, userId);

    const type = dto.type ?? existing.type;
    const config = dto.config ?? existing.config;

    this.validateIndicator({
      type,
      config,
    });

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
