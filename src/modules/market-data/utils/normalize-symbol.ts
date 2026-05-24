export function normalizeSymbol(input: string): string {
  const clean = input.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

  if (clean.endsWith('USDT') || clean.endsWith('USDC')) {
    return clean;
  }

  return `${clean}USDT`;
}
