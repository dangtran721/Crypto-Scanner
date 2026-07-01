import { BadGatewayException } from '@nestjs/common';
import { Indicator } from '@prisma/client';
import { StrategiesMap } from 'src/modules/indicator/strategies';
import { MarketDataService } from 'src/modules/market-data/market-data.service';
import { ScannerService } from 'src/modules/scan-jobs/scanner.service';
import { ScanCondition, ScanOperand } from 'src/modules/scanrule/types';
import { PrismaService } from 'src/prisma/prisma.service';

const specGetCandles = jest.fn();
const specGetStrategy = jest.fn();
const specPrismaFindFirst = jest.fn();
const specPrismaFindMany = jest.fn();
const specPrismaUpdate = jest.fn();
const specPrismaTransaction = jest.fn();

// Mocking ScannerService property
const specPrismaService = {
  scanJob: { findFirst: specPrismaFindFirst, update: specPrismaUpdate },
  indicator: { findMany: specPrismaFindMany },
  $transaction: specPrismaTransaction,
} as unknown as PrismaService;

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

  // Got it before faced, a mock state did not reset causing those stacked up
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should throw error if evaluateSymbol fails', async () => {
    // Mocking evaluateSymbol throw  Error('Symbol error')
    jest
      .spyOn(service, 'evaluateSymbol')
      .mockRejectedValue(new Error('Symbol error'));

    const result = service.evaluateJob(specType, job, indicatorMap);
    await expect(result).rejects.toThrow('Symbol error');
  });

  it('should evaluate all items in the watchlist', async () => {
    const evaluateSymbolSpyOn = jest
      .spyOn(service, 'evaluateSymbol')
      .mockImplementation(async (type, symbol) => {
        return { type, symbol } as any;
      });
    const results = service.evaluateJob(specType, job, indicatorMap);

    expect((await results)[0].coinSymbol).toBe('BTCUSDT');
    expect((await results)[1].coinSymbol).toBe('ETHUSDT');

    expect(evaluateSymbolSpyOn).toHaveBeenCalledTimes(2);
  });
});

describe('ScannerService - runJob', () => {
  beforeEach(() => {
    specPrismaFindFirst.mockReset();
  });

  it('Should throw ScanJob not found when !job', async () => {
    await expect(service.runJob(specType, 1, 1)).rejects.toThrow(
      'ScanJob not found',
    );
  });

  it('Should throw Invalid indicators when indicators != indicatorIds', async () => {
    const specLogic = {
      ...specInvalidLogic,
      operator: 'cross_above',
    } as unknown as ScanCondition;

    specPrismaFindFirst.mockReturnValue({ scanRule: { logic: { specLogic } } });

    specPrismaFindMany.mockReturnValue(1);

    await expect(service.runJob(specType, 1, 1)).rejects.toThrow(
      'Invalid indicators',
    );
  });

  it('should fallback to mock provider when Binance API is blocked', async () => {
    const specLogic = {
      ...specInvalidLogic,
      operator: 'cross_above',
    } as unknown as ScanCondition;

    specPrismaFindFirst.mockReturnValue({ scanRule: { logic: { specLogic } } });
    specPrismaFindMany.mockReturnValue([]);

    const evaluateJobSpy = jest.spyOn(service, 'evaluateJob') as jest.Mock;

    const error = new BadGatewayException(
      'Binance API is blocked in this deployment region',
    );
    error.message = 'Binance API is blocked in this deployment region';

    const resolvedValue = [
      {
        coinSymbol: 'BTCUSDT',
        result: {
          left: { curr: 1, prev: 1 },
          right: { curr: 1, prev: 1 },
          operator: 'gt',
        },
        isValidSetup: true,
      },
    ];

    evaluateJobSpy
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce(resolvedValue);

    const result = await service.runJob(specType, 1, 1);

    expect(result.fallback).toBe(true);
    expect(result.providerUsed).toBe('mock');
    expect(evaluateJobSpy).toHaveBeenCalledTimes(2);
  });

  it('should fallback to mock provider when Binance API is blocked', async () => {
    const specLogic = {
      ...specInvalidLogic,
      operator: 'cross_above',
    } as unknown as ScanCondition;

    specPrismaFindFirst.mockReturnValue({ scanRule: { logic: { specLogic } } });
    specPrismaFindMany.mockReturnValue([]);

    const evaluateJobSpy = jest.spyOn(service, 'evaluateJob') as jest.Mock;

    const error = new BadGatewayException(
      'Binance API is blocked in this deployment region',
    );
    error.message = 'Binance API is blocked in this deployment region';

    const resolvedValue = [
      {
        coinSymbol: 'BTCUSDT',
        result: {
          left: { curr: 1, prev: 1 },
          right: { curr: 1, prev: 1 },
          operator: 'gt',
        },
        isValidSetup: true,
      },
    ];

    specPrismaTransaction.mockReturnValue({
      data: {
        jobId: 1,
      },
    });

    evaluateJobSpy
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce(resolvedValue);

    const result = await service.runJob(specType, 1, 1);
    expect(result).toEqual({
      providerRequested: 'binance',
      providerUsed: 'mock',
      fallback: true,
      message:
        'All market providers are unavailable, so mock market data was used',
      results: {
        data: {
          jobId: 1,
        },
      },
    });
  });
});
