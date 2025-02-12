'use client';
import React, { useState, useMemo } from 'react';
import { LotteryMatrix } from './lottery-matrix';
import { LOTTERY_CONFIG, LotteryType } from './lottery-config';

interface LotteryViewProps {
  initialData: Array<{ id: string; numbers: number[]; date: string }>;
  type: LotteryType;
}

const drawCountOptions = [10, 20, 30, 40, 50, -1] as const; // -1 represents "All"

export const LotteryView = ({ initialData, type }: LotteryViewProps) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [drawCount, setDrawCount] = useState<number>(-1);
  
  // Sort data by date descending initially
  const sortedData = useMemo(() => 
    [...initialData].sort((a, b) => b.date.localeCompare(a.date)),
    [initialData]
  );

  // Apply filters
  const filteredData = useMemo(() => {
    let result = sortedData;
    
    // Date filter
    if (startDate || endDate) {
      result = result.filter(entry => {
        const entryDate = entry.date;
        return (!startDate || entryDate >= startDate) && 
               (!endDate || entryDate <= endDate);
      });
    }
    
    // Draw count filter
    if (drawCount > 0) {
      result = result.slice(0, drawCount);
    }
    
    return result;
  }, [sortedData, startDate, endDate, drawCount]);

  // Date range boundaries
  const { minDate, maxDate } = useMemo(() => ({
    minDate: sortedData[sortedData.length - 1]?.date || '',
    maxDate: sortedData[0]?.date || ''
  }), [sortedData]);

  return (
    <div className="lottery-view-container p-4 bg-white rounded-lg shadow-lg border border-gray-200 max-w-screen-xl mx-auto">
      {/* Filters Section */}
      <div className="filters flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="date-filters flex gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">From:</label>
            <input
              type="date"
              value={startDate}
              min={minDate}
              max={maxDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">To:</label>
            <input
              type="date"
              value={endDate}
              min={minDate}
              max={maxDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Show last:</label>
          <select
            value={drawCount}
            onChange={(e) => setDrawCount(Number(e.target.value))}
            className="px-3 py-2 border rounded-md text-sm"
          >
            {drawCountOptions.map(option => (
              <option key={option} value={option}>
                {option === -1 ? 'All' : `${option} draws`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Matrix Container */}
      <div className="matrix-container border rounded-lg overflow-auto max-h-[70vh]">
        <LotteryMatrix data={filteredData} type={type} />
      </div>

      {/* Results Count */}
      <div className="mt-4 text-sm text-gray-600 text-center">
        Showing {filteredData.length} results
        {(startDate || endDate) && ` between ${startDate || 'earliest'} and ${endDate || 'latest'}`}
      </div>
    </div>
  );
};