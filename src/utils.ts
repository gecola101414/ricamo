export const parseNumber = (value: string): number => {
  if (!value) return 0;
  return parseFloat(value.replace(',', '.'));
};
