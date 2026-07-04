import { Indicator } from '@prisma/client';
import { IndicatorService } from 'src/modules/indicator/indicator.service';
import { StrategiesMap } from 'src/modules/indicator/strategies';
import { PrismaService } from 'src/prisma/prisma.service';

const specGetStrategy = jest.fn();
const specPrismaFindFirst = jest.fn();
const specPrismaFindMany = jest.fn();
const specPrismaUpdate = jest.fn();
const specPrismaTransaction = jest.fn();

const specPrismaService = {
  scanJob: { findFirst: specPrismaFindFirst, update: specPrismaUpdate },
  indicator: { findMany: specPrismaFindMany },
  $transaction: specPrismaTransaction,
} as unknown as PrismaService;

const specStrategyMap = {
  getStrategy: specGetStrategy,
} as unknown as StrategiesMap;

const service = new IndicatorService(specPrismaService, specStrategyMap);

// Indicator
const specIndicator = {
  id: 1,
  type: 'EMA',
  userId: 1,
  config: { period: 34 },
  createdAt: new Date(),
} as Indicator;

describe('IndicatorService - validateIndicator', () => {
  it('Should throw Unsupported indicator type when input wrong indicator type', async () => {
    const specInvalidIndicator = {
      ...specIndicator,
      type: 'Invalid',
    } as unknown as Indicator;
    expect(() => {
      service.validateIndicator(specInvalidIndicator);
    }).toThrow('Unsupported indicator type');
  });
});
