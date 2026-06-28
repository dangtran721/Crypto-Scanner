import { StrategiesMap } from 'src/modules/indicator/strategies';
import { MarketDataService } from 'src/modules/market-data/market-data.service';
import { ScannerService } from 'src/modules/scan-jobs/scanner.service';
import { ScanOperand } from 'src/modules/scanrule/types';
import { PrismaService } from 'src/prisma/prisma.service';

describe('ScannerService - resolveOperand', () => {
  let service: ScannerService;
  const specPrismaService = {} as PrismaService;
  const specMarketDataService = {} as MarketDataService;
  const specStrategyMap = {} as StrategiesMap;
  beforeEach(() => {
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
  });
});
