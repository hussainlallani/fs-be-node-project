function formatNumber(num: number | undefined | null): string {
  if (typeof num !== "number" || isNaN(num)) return "0";

  const fixedNum = num.toFixed(2);
  return fixedNum.endsWith(".00")
    ? parseInt(fixedNum, 10).toString()
    : fixedNum;
}

export default formatNumber;
