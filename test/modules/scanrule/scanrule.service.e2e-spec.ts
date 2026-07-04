import { ScanruleService } from 'src/modules/scanrule/scanrule.service';
import { ScanCondition } from 'src/modules/scanrule/types';
import { PrismaService } from 'src/prisma/prisma.service';

const specPrismaFindMany = jest.fn();

const specPrismaService = {
  indicator: { findMany: specPrismaFindMany },
} as unknown as PrismaService;

const service = new ScanruleService(specPrismaService);

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
describe('ScanruleService - validateScanRule', () => {
  const specLogic = {
    ...specInvalidLogic,
    operator: 'cross_above',
  } as unknown as ScanCondition;

  it('Should throw Invalid config for scanRule when logic wrong', async () => {
    await expect(service.validateScanRule(specInvalidLogic, 1)).rejects.toThrow(
      'Invalid config for scanRule',
    );
  });

  it('Should throw Invalid indicator ownership when indicators != indicatorIds', async () => {
    specPrismaFindMany.mockReturnValue([1, 2]);
    await expect(service.validateScanRule(specLogic, 1)).rejects.toThrow(
      'Invalid indicator ownership',
    );
  });

  it('Should throw Invalid indicator ownership when indicators != indicatorIds', async () => {
    specPrismaFindMany.mockReturnValue([1]);
    expect(await service.validateScanRule(specLogic, 1)).toEqual({
      type: 'condition',
      timeFrames: '1d',
      operator: 'cross_above',
      left: { type: 'indicator', indicatorId: 1 },
      right: {
        type: 'value',
        value: 10,
      },
    });
  });
});
