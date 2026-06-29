import { Indicator } from '@prisma/client';
import { StrategiesMap } from 'src/modules/indicator/strategies';
import { MarketDataService } from 'src/modules/market-data/market-data.service';
import { ScannerService } from 'src/modules/scan-jobs/scanner.service';
import { ScanCondition, ScanOperand } from 'src/modules/scanrule/types';
import { PrismaService } from 'src/prisma/prisma.service';

const specGetCandles = jest.fn();
const specGetStrategy = jest.fn();

// Mocking ScannerService property
const specPrismaService = {} as PrismaService;

const specMarketDataService = {
  getCandles: specGetCandles,
} as unknown as MarketDataService;

const specStrategyMap = {
  getStrategy: specGetStrategy,
} as unknown as StrategiesMap;

// Create service
const service = new ScannerService(
  specPrismaService,
  specMarketDataService,
  specStrategyMap,
);

// Mocking evaluateSymbol property
const specType = 'binance';
const specSymbol = ' BTCUSDT';
// Indicator
const specIndicator = {
  id: 1,
  type: 'EMA',
  userId: 1,
  config: { period: 34 },
  createdAt: new Date(),
} as Indicator;

const indicatorMap = new Map<number, Indicator>();
indicatorMap.set(1, specIndicator);

describe('ScannerService - resolveOperand', () => {
  beforeEach(() => {
    specGetStrategy.mockReset();
  });
  it('should return value directly when operand type is "value"', async () => {
    const operand = {
      type: 'value',
      value: 10,
    } as ScanOperand;

    const result = await service.resolveOperand(operand, [], new Map());
    expect(result).toEqual({ prev: 10, curr: 10 });
  });

  it('Should throw error when invalid operand', async () => {
    const operand = {
      type: 'idk',
      value: 0,
    } as unknown as ScanOperand;

    const result = service.resolveOperand(operand, [], new Map());
    await expect(result).rejects.toThrow('Invalid operand');
  });

  it('should throw Invalid indicator if indicator does not exist', async () => {
    const operand = { type: 'indicator', indicatorId: 1 } as ScanOperand;

    await expect(
      service.resolveOperand(operand, [], new Map()),
    ).rejects.toThrow('Invalid indicator');
  });

  it('should throw Invalid strategy if strategy is not found', async () => {
    const operand = { type: 'indicator', indicatorId: 1 } as ScanOperand;
    const specIndicator = {
      id: 1,
      type: 'EMA',
      userId: 1,
      config: { period: 14 },
      createdAt: new Date(),
    } as Indicator;

    const indicatorMap = new Map<number, Indicator>();
    indicatorMap.set(1, specIndicator);

    specGetStrategy.mockReturnValue(undefined);

    await expect(
      service.resolveOperand(operand, [], indicatorMap),
    ).rejects.toThrow('Invalid strategy');
  });

  it('should throw Invalid strategy if strategy is not found', async () => {
    const operand = { type: 'indicator', indicatorId: 1 } as ScanOperand;
    const specIndicator = {
      id: 1,
      type: 'EMA',
      userId: 1,
      config: { period: 14 },
      createdAt: new Date(),
    } as Indicator;

    const indicatorMap = new Map<number, Indicator>();
    indicatorMap.set(1, specIndicator);

    const specCalculate = {
      calculate: jest.fn().mockReturnValue([]),
    };

    specGetStrategy.mockReturnValue(specCalculate);

    await expect(
      service.resolveOperand(operand, [], indicatorMap),
    ).rejects.toThrow('Indicator calculation failed');
    expect(specStrategyMap.getStrategy).toHaveBeenCalledWith('EMA');
  });

  it('should return right value', async () => {
    const operand = { type: 'indicator', indicatorId: 1 } as ScanOperand;
    const specIndicator = {
      id: 1,
      type: 'EMA',
      userId: 1,
      config: { period: 14 },
      createdAt: new Date(),
    } as Indicator;

    const indicatorMap = new Map<number, Indicator>();
    indicatorMap.set(1, specIndicator);

    const specCalculate = {
      calculate: jest.fn().mockReturnValue([34, 89]),
    };

    specGetStrategy.mockReturnValue(specCalculate);

    expect(await service.resolveOperand(operand, [], indicatorMap)).toEqual({
      prev: 34,
      curr: 89,
    });

    expect(specStrategyMap.getStrategy).toHaveBeenCalledWith('EMA');
  });
});

describe('ScannerService - evaluateSymbol', () => {
  beforeEach(() => {
    specGetStrategy.mockReset();
    specGetCandles.mockReset();
  });

  const specInvalidLogic = {
    type: 'condition',
    timeFrames: '1d',
    operator: 'Invalid',
    left: { type: 'indicator', indicatorId: 1 },
    right: {
      type: 'value',
      value: 10,
    },
  } as unknown as ScanCondition;

  it(`Should throw Unsupported operator: ${specInvalidLogic.operator} when !operatorFn`, async () => {
    specGetStrategy.mockReturnValue({
      calculate: jest.fn().mockReturnValue([10, 20]),
    });

    await expect(
      service.evaluateSymbol(
        specType,
        specSymbol,
        specInvalidLogic,
        indicatorMap,
      ),
    ).rejects.toThrow(`Unsupported operator: ${specInvalidLogic.operator}`);
  });

  it('Should return right values', async () => {
    const specLogic = {
      ...specInvalidLogic,
      operator: 'cross_above',
    } as unknown as ScanCondition;

    specGetCandles.mockReturnValue([]);
    specGetStrategy.mockReturnValue({
      calculate: jest.fn().mockReturnValue([10, 20]),
    });

    expect(
      await service.evaluateSymbol(
        specType,
        specSymbol,
        specLogic,
        indicatorMap,
      ),
    ).toEqual({
      type: specType,
      coinSymbol: specSymbol,
      result: {
        left: { curr: 20, prev: 10 },
        right: { curr: 10, prev: 10 },
        operator: specLogic.operator,
      },
      isValidSetup: true,
    });
  });
});

describe('ScannerService - evaluateJob', () => {
  const job = {
    id: 1,
    scanRule: {
      logic: {},
    },
    watchlist: {
      items: [
        {
          coinSymbol: 'BTCUSDT',
        },
        {
          coinSymbol: 'ETHUSDT',
        },
      ],
    },
  };
  it('should throw error if evaluateSymbol fails', async () => {
    // Mocking evaluateSymbol throw  Error('Symbol error')
    jest
      .spyOn(service, 'evaluateSymbol')
      .mockRejectedValue(new Error('Symbol error'));

    const result = service.evaluateJob(specType, job, indicatorMap);
    await expect(result).rejects.toThrow('Symbol error');
  });
});
