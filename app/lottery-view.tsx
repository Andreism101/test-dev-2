'use client';
import { useState, useMemo } from 'react';
import { LotteryMatrix } from './lottery-matrix';
import { LOTTERY_CONFIG, LotteryType } from './lottery-config';

type FilterType = 'date-range' | 'last-draws';
const LOTTERY_TYPES: LotteryType[] = ['2DL', '3DL', '4DL', '6DL', 'LOTTO42', 'ML45', 'SL49', 'GL55', 'UL58'];
const DRAW_COUNTS = [10, 20, 30, 40, 50, -1] as const;

interface LotteryViewProps {
  allData: Array<{
    id: string;
    lotteryType: LotteryType;
    numbers: number[];
    date: string;
  }>;
}

export const LotteryView = ({ allData }: LotteryViewProps) => {
  const [selectedLottery, setSelectedLottery] = useState<LotteryType>('2DL');
  const [filterType, setFilterType] = useState<FilterType>('last-draws');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [drawCount, setDrawCount] = useState<number>(30);

  // Filter data by selected lottery type
  const filteredByLottery = useMemo(() => 
    allData.filter(entry => entry.lotteryType === selectedLottery),
    [allData, selectedLottery]
  );

  // Sort data by date descending
  const sortedData = useMemo(() => 
    [...filteredByLottery].sort((a, b) => b.date.localeCompare(a.date)),
    [filteredByLottery]
  );

  // Apply active filters
  const filteredData = useMemo(() => {
    if (filterType === 'date-range') {
      return sortedData.filter(entry => {
        const date = entry.date;
        return (!startDate || date >= startDate) && (!endDate || date <= endDate);
      });
    }
    return drawCount === -1 ? sortedData : sortedData.slice(0, drawCount);
  }, [sortedData, filterType, startDate, endDate, drawCount]);

  // Date boundaries for current lottery
  const { minDate, maxDate } = useMemo(() => ({
    minDate: sortedData[sortedData.length - 1]?.date || '',
    maxDate: sortedData[0]?.date || ''
  }), [sortedData]);

  return (
    <div className="lottery-view-container p-4 bg-white rounded-lg shadow-lg border border-gray-200 max-w-screen-xl mx-auto">
      {/* Header and Lottery Selection */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {LOTTERY_CONFIG[selectedLottery].displayName} Results
        </h1>
        
      </div>

      {/* Filter Controls */}
      <div className="filters flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <select
            value={selectedLottery}
            onChange={(e) => setSelectedLottery(e.target.value as LotteryType)}
            className="px-4 py-2 border rounded-md text-sm font-medium"
          >
            {LOTTERY_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value as FilterType);
              // Reset other filter when switching types
              if (e.target.value === 'last-draws') {
                setStartDate('');
                setEndDate('');
              } else {
                setDrawCount(-1);
              }
            }}
            className="px-4 py-2 border rounded-md text-sm"
          >
            <option value="last-draws">Show Last Draws</option>
            <option value="date-range">Filter by Date Range</option>
          </select>

          {filterType === 'last-draws' && (
            <select
              value={drawCount}
              onChange={(e) => setDrawCount(Number(e.target.value))}
              className="px-4 py-2 border rounded-md text-sm"
            >
              {DRAW_COUNTS.map(count => (
                <option key={count} value={count}>
                  {count === -1 ? 'All Draws' : `Last ${count}`}
                </option>
              ))}
            </select>
          )}

          {filterType === 'date-range' && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                min={minDate}
                max={maxDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
                placeholder="Start Date"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={endDate}
                min={minDate}
                max={maxDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
                placeholder="End Date"
              />
            </div>
          )}
        </div>
      </div>

      {/* Matrix Container */}
      <div className="matrix-container border rounded-lg overflow-auto max-h-[70vh]">
        <LotteryMatrix 
          data={filteredData} 
          type={selectedLottery}
          key={selectedLottery} // Force re-render on lottery change
        />
      </div>

      {/* Results Summary */}
      <div className="mt-4 text-sm text-gray-600 text-center">
        Showing {filteredData.length} results
        {filterType === 'date-range' && (
          ` between ${startDate || minDate} and ${endDate || maxDate}`
        )}
      </div>
    </div>
  );
};