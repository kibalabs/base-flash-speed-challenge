export const assetValueToNumber = (value: bigint, decimals: number, precision: number = 18): number => {
  const divisor = 10 ** precision;
  return Number((value * BigInt(divisor)) / BigInt(10) ** BigInt(decimals)) / divisor;
};

export const multiplyBigIntFloat = (value: bigint, multiplier: number, precision: number = 18): bigint => {
  const divisor = 10 ** precision;
  return (value * BigInt(divisor * multiplier)) / BigInt(divisor);
};
