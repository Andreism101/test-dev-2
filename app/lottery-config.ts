export type LotteryType = '2DL' | '3DL' | '4DL' | '6DL' | 'LOTTO42' | 'ML45' | 'SL49' | 'GL55' | 'UL58';

type LotteryConfig = {
  displayName: string;
  numbersPerDraw: number;
  min: number;
  max: number;
  formatNumber: (n: number) => string;
  image: string;
};

export const LOTTERY_CONFIG: Record<LotteryType, LotteryConfig> = {
  '2DL': {
    displayName: '2D Lotto',
    numbersPerDraw: 2,
    min: 1,
    max: 31,
    formatNumber: n => n.toString().padStart(2, '0'),
    image: 'Lotto-2D_128x128.png'
  },
  '3DL': {
    displayName: '3D Lotto',
    numbersPerDraw: 3,
    min: 0,
    max: 9,
    formatNumber: n => n.toString(),
    image: 'Lotto-2D_128x128.png'
  },
  '4DL': {
    displayName: '4D Lotto',
    numbersPerDraw: 4,
    min: 0,
    max: 9,
    formatNumber: n => n.toString(),
    image: 'Lotto-2D_128x128.png'
  },
  '6DL': {
    displayName: '6D Lotto',
    numbersPerDraw: 6,
    min: 0,
    max: 9,
    formatNumber: n => n.toString(),
    image: 'Lotto-2D_128x128.png'
  },
  'LOTTO42': {
    displayName: 'Lotto 6/42',
    numbersPerDraw: 6,
    min: 1,
    max: 42,
    formatNumber: n => n.toString().padStart(2, '0'),
    image: 'Lotto-2D_128x128.png'
  },
  'ML45': {
    displayName: 'Mega Lotto 6/45',
    numbersPerDraw: 6,
    min: 1,
    max: 45,
    formatNumber: n => n.toString().padStart(2, '0'),
    image: 'Lotto-2D_128x128.png'
  },
  'SL49': {
    displayName: 'Super Lotto 6/49',
    numbersPerDraw: 6,
    min: 1,
    max: 49,
    formatNumber: n => n.toString().padStart(2, '0'),
    image: 'Lotto-2D_128x128.png'
  },
  'GL55': {
    displayName: 'Grand Lotto 6/55',
    numbersPerDraw: 6,
    min: 1,
    max: 55,
    formatNumber: n => n.toString().padStart(2, '0'),
    image: 'Lotto-2D_128x128.png'
  },
  'UL58': {
    displayName: 'Ultra Lotto 6/58',
    numbersPerDraw: 6,
    min: 1,
    max: 58,
    formatNumber: n => n.toString().padStart(2, '0'),
    image: 'Lotto-2D_128x128.png'
  }
}satisfies Record<LotteryType, LotteryConfig>;