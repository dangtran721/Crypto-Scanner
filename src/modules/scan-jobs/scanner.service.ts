import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { extractIndicatorIds } from 'src/common/utils';
import { MarketDataService } from '../market-data/market-data.service';
import { Candle } from 'src/common/types';
import { StrategiesMap } from '../indicator/strategies';
import { Indicator, Prisma, ScanRun, Status } from '@prisma/client';
import { ScanCondition, ScanOperand } from '../scanrule/types';
import {
  IndicatorValue,
  ScanJobWithData,
  ScanResultItemType,
  ScanResultType,
} from './types';
import { MarketDataType } from '../market-data/types';

@Injectable()
export class ScannerService {
  constructor(
    private prisma: PrismaService,
    private marketData: MarketDataService,
    private strategyMap: StrategiesMap,
  ) {}

  async resolveOperand(
    operand: ScanOperand,
    candles: Candle[],
    indicatorMap: Map<number, Indicator>,
  ): Promise<IndicatorValue> {
    if (operand.type === 'value') {
      return {
        prev: operand.value,
        curr: operand.value,
      };
    }

    if (operand.type === 'indicator') {
      const indicator = indicatorMap.get(operand.indicatorId);

      if (!indicator) {
        throw new NotFoundException('Invalid indicator');
      }
      // block ichimoku (temp)
      if (indicator.type === 'ICHIMOKU') {
        throw new BadRequestException('ICHIMOKU not supported in scanner yet');
      }

      const strategy = this.strategyMap.getStrategy(indicator?.type);
      if (!strategy) {
        throw new NotFoundException('Invalid strategy');
      }

      const values = strategy.calculate(candles, indicator.config);

      if (!values.length) {
        throw new BadRequestException('Indicator calculation failed');
      }

      if (values.length < 2) {
        throw new BadRequestException('Not enough data');
      }

      return {
        prev: values[values.length - 2],
        curr: values[values.length - 1],
      };
    }
    throw new Error('Invalid operand');
  }

  async evaluateSymbol(
    type: MarketDataType,
    symbol: string,
    logic: ScanCondition,
    indicatorMap: Map<number, Indicator>,
  ): Promise<ScanResultItemType> {
    const candles = await this.marketData.getCandles(
      type,
      symbol,
      logic.timeFrames,
    );

    const left = await this.resolveOperand(logic.left, candles, indicatorMap);
    const right = await this.resolveOperand(logic.right, candles, indicatorMap);

    const operatorMap = {
      gt: (a: IndicatorValue, b: IndicatorValue) => a.curr > b.curr,
      lt: (a: IndicatorValue, b: IndicatorValue) => a.curr < b.curr,

      cross_above: (a: IndicatorValue, b: IndicatorValue) =>
        a.prev <= b.prev && a.curr > b.curr,

      cross_below: (a: IndicatorValue, b: IndicatorValue) =>
        a.prev >= b.prev && a.curr < b.curr,
    };

    const operatorFn = operatorMap[logic.operator];
    if (!operatorFn)
      throw new BadRequestException(`Unsupported operator: ${logic.operator}`);

    const isValid = operatorFn(left, right);

    return {
      type,
      coinSymbol: symbol,
      result: {
        left,
        right,
        operator: logic.operator,
      },
      isValidSetup: isValid,
    };
  }

  async evaluateJob(
    type: MarketDataType,
    job: ScanJobWithData,
    indicatorsMap: Map<number, Indicator>,
  ): Promise<Omit<ScanResultType, 'scanRunId'>[]> {
    const results: Omit<ScanResultType, 'scanRunId'>[] = [];

    for (const item of job.watchlist.items) {
      const result = await this.evaluateSymbol(
        type,
        item.coinSymbol,
        job.scanRule.logic,
        indicatorsMap,
      );

      results.push({
        coinSymbol: item.coinSymbol,
        result: result.result,
        isValidSetup: result.isValidSetup,
      });
    }

    return results;
  }

  async runJob(
    type: MarketDataType,
    scanJobId: number,
    userId: number,
  ): Promise<ScanResultType[]> {
    const job = await this.prisma.scanJob.findFirst({
      where: { id: scanJobId, userId },
      include: {
        watchlist: { include: { items: true } },
        scanRule: true,
      },
    });

    if (!job) {
      throw new NotFoundException('ScanJob not found');
    }

    const indicatorIds = extractIndicatorIds(
      job.scanRule.logic as ScanCondition,
    );
    const indicators = await this.prisma.indicator.findMany({
      where: { id: { in: indicatorIds }, userId },
    });

    if (indicators.length !== indicatorIds.length) {
      throw new BadRequestException('Invalid indicators');
    }

    const indicatorsMap = new Map(indicators.map((item) => [item.id, item]));

    await this.prisma.scanJob.update({
      where: { id: job.id, userId },
      data: {
        status: Status.RUNNING,
      },
    });

    const rawResults = await this.evaluateJob(type, job, indicatorsMap);

    try {
      const results = await this.prisma.$transaction(async (tx) => {
        const run = await tx.scanRun.create({
          data: {
            jobId: job.id,
          },
        });

        const resultsWithRunId = rawResults.map((r) => ({
          ...r,
          scanRunId: run.id,
        }));

        await this.saveResults(tx, job, userId, resultsWithRunId);
        await this.clearOldRun(tx, job.id);

        return resultsWithRunId;
      });
      return results;
    } catch (error) {
      await this.prisma.scanJob.update({
        where: { id: job.id, userId },
        data: {
          status: Status.FAILED,
        },
      });
      throw error;
    }
  }

  async saveResults(
    tx: Prisma.TransactionClient,
    job: ScanJobWithData,
    userId: number,
    resultsData: ScanResultType[],
  ): Promise<void> {
    await tx.scanResult.createMany({ data: resultsData });

    await tx.scanJob.update({
      where: { id: job.id, userId },
      data: {
        status: Status.COMPLETED,
      },
    });
  }

  async clearOldRun(
    tx: Prisma.TransactionClient,
    jobId: number,
  ): Promise<void> {
    const runsToDelete = await tx.scanRun.findMany({
      where: { jobId },
      orderBy: { createdAt: 'desc' },
      skip: 5,
      select: { id: true },
    });

    await tx.scanRun.deleteMany({
      where: {
        id: {
          in: runsToDelete.map((r) => r.id),
        },
      },
    });
  }
  async findAllResultsById(jobId: number, userId: number): Promise<ScanRun[]> {
    const job = await this.prisma.scanJob.findFirst({
      where: { id: jobId, userId },
      include: { scanRuns: true },
    });

    if (!job) {
      throw new NotFoundException('ScanJob not found');
    }

    const runs = await this.prisma.scanRun.findMany({
      where: { jobId: job.id },
      include: {
        results: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return runs;
  }
}
