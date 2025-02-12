import { LOTTERY_CONFIG, LotteryType } from './lottery-config';

export const parseLotteryNumbers = (
  input: string,
  type: LotteryType
): number[] | null => {
  const config = LOTTERY_CONFIG[type];
  const numbers = input.split(',')
    .map(n => parseInt(n.trim(), 10))
    .filter(n => !isNaN(n) && n >= config.min && n <= config.max);

  return numbers.length === config.numbersPerDraw ? numbers : null;
};

export const generateNumberRange = (type: LotteryType): number[] => {
  const { min, max } = LOTTERY_CONFIG[type];
  return Array.from({ length: max - min + 1 }, (_, i) => min + i);
};

// Add to your existing date utils
export const parseDate = (dateValue: any): Date | null => {
    if (typeof dateValue === 'number') {
        // Excel dates are counted from 1900-01-01
        const excelEpoch = new Date(1900, 0, 1);
        const daysSinceEpoch = dateValue - 1; // Subtract 1 to account for Excel's day count
        const milliseconds = daysSinceEpoch * 24 * 60 * 60 * 1000;
        return new Date(excelEpoch.getTime() + milliseconds);
    }

    // Handle string date formats
    if (typeof dateValue === 'string') {
        const date = new Date(dateValue);
        if (!isNaN(date.getTime())) {
            return date;
        }
    }

    return null;
  };
  
  export const formatDate = (date: Date): string => {
        return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
    };