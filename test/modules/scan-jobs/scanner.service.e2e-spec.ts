import { Indicator } from '@prisma/client';
import { StrategiesMap } from 'src/modules/indicator/strategies';
import { MarketDataService } from 'src/modules/market-data/market-data.service';
import { ScannerService } from 'src/modules/scan-jobs/scanner.service';
import { ScanCondition, ScanOperand } from 'src/modules/scanrule/types';
import { PrismaService } from 'src/prisma/prisma.service';

describe('ScannerService - resolveOperand', () => {
  let service: ScannerService;

  const specPrismaService = {} as PrismaService;
  const specMarketDataService = {} as MarketDataService;

  const specGetStrategy = jest.fn();

  const specStrategyMap = {
    getStrategy: specGetStrategy,
  } as unknown as StrategiesMap;

  beforeEach(() => {
    specGetStrategy.mockReset();

    service = new ScannerService(
      specPrismaService,
      specMarketDataService,
      specStrategyMap,
    );
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
  let service: ScannerService;

  const specGetCandles = jest.fn().mockReturnValue([]);
  const specGetStrategy = jest.fn();

  const specPrismaService = {} as PrismaService;
  const specMarketDataService = {
    getCandles: specGetCandles,
  } as unknown as MarketDataService;

  const specStrategyMap = {
    getStrategy: specGetStrategy,
  } as unknown as StrategiesMap;

  beforeEach(() => {
    specGetCandles.mockReset();
    specGetStrategy.mockReset();

    service = new ScannerService(
      specPrismaService,
      specMarketDataService,
      specStrategyMap,
    );
  });

  const specType = 'binance';
  const specSymbol = ' BTCUSDT';

  const specIndicator = {
    id: 1,
    type: 'EMA',
    userId: 1,
    config: { period: 34 },
    createdAt: new Date(),
  } as Indicator;

  const specLogic = {
    type: 'condition',
    timeFrames: '1d',
    operator: 'idk',
    left: { type: 'indicator', indicatorId: 1 },
    right: {
      type: 'value',
      value: 10,
    },
  } as unknown as ScanCondition;

  it(`Should throw Unsupported operator: ${specLogic.operator} when !operatorFn`, async () => {
    const indicatorMap = new Map<number, Indicator>();
    indicatorMap.set(1, specIndicator);

    specGetStrategy.mockReturnValue({
      calculate: jest.fn().mockReturnValue([10, 20]),
    });

    await expect(
      service.evaluateSymbol(specType, specSymbol, specLogic, indicatorMap),
    ).rejects.toThrow(`Unsupported operator: ${specLogic.operator}`);
  });
});
