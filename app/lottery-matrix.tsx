'use client';
import React, { useState, useMemo } from 'react';
import { LOTTERY_CONFIG, LotteryType } from './lottery-config';
import { generateNumberRange } from './lottery-utils';

interface LotteryMatrixProps {
  data: Array<{ id: string; numbers: number[]; date: string }>;
  type: LotteryType;
}

export const LotteryMatrix = ({ data, type }: LotteryMatrixProps) => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isExpanded, setIsExpanded] = useState(false);
  const config = LOTTERY_CONFIG[type];
  
  // Generate all possible numbers for this lottery type
  const allNumbers = useMemo(() => generateNumberRange(type), [type]);
  
  // Calculate occurrences
  const numberCounts = useMemo(() => {
    const counts = new Map<number, number>();
    allNumbers.forEach(n => counts.set(n, 0));
    
    data.forEach(({ numbers }) => {
      numbers.forEach(n => counts.set(n, (counts.get(n) || 0) + 1));
    });
    
    return counts;
  }, [data, allNumbers]);

  // Create sorted totals by frequency
  const frequencySorted = useMemo(() => 
    [...allNumbers].sort((a, b) => 
      (numberCounts.get(b) || 0) - (numberCounts.get(a) || 0)
    ), 
    [allNumbers, numberCounts]
  );

  // Get top and low numbers based on config
  const { topCount, lowCount } = config;
  const [topNumbers, lowNumbers] = useMemo(() => [
    new Set(frequencySorted.slice(0, topCount)),
    new Set(frequencySorted.slice(-lowCount))
  ], [frequencySorted, topCount, lowCount]);

  // Create sorted display numbers
  const sortedNumbers = useMemo(() => 
    [...allNumbers].sort((a, b) => {
      const countA = numberCounts.get(a) || 0;
      const countB = numberCounts.get(b) || 0;
      return sortOrder === 'desc' ? countB - countA : countA - countB;
    }), 
    [allNumbers, numberCounts, sortOrder]
  );

  const maxCount = useMemo(() => 
    Math.max(...Array.from(numberCounts.values())),
    [numberCounts]
  );

  return (
    <div className="lottery-matrix">
      <div className="matrix-container">
        {/* Numbers Column */}
        <div className="matrix-column headers">
          <div className="cell header-cell">Numbers</div>
          {sortedNumbers.map(n => {
            const isHigh = topNumbers.has(n);
            const isLow = lowNumbers.has(n);
            return (
              <span 
                key={n} 
                className={`cell number-label ${isHigh ? 'high' : ''} ${isLow ? 'low' : ''}`}
              >
                <span>{config.formatNumber(n)}</span>
              </span>
            );
          })}
        </div>

        {/* Toggle Button */}
        <button 
          className="toggle-button"
          onClick={() => setIsExpanded(!isExpanded)}
          style={{ zIndex: 3 }}
        >
          {isExpanded ? '⇆' : '⇆'}
        </button>

        {/* Data Columns (conditionally rendered) */}
        {isExpanded && data.map(entry => (
          <div key={entry.id} className="matrix-column">
            <div className="cell header-cell">{entry.date}</div>
            {sortedNumbers.map(n => (
              <div key={n} className="cell">
                {entry.numbers.includes(n) && <span className="text-3xl">❌</span>}
              </div>
            ))}
          </div>
        ))}

        {/* Totals Column */}
        <div className="matrix-column totals">
          <button 
            className="cell header-cell"
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
          >
            Totals {sortOrder === 'desc' ? '↓' : '↑'}
          </button>
          {sortedNumbers.map(n => {
            const count = numberCounts.get(n) || 0;
            const isHigh = topNumbers.has(n);
            const isLow = lowNumbers.has(n);
            return (
              <div 
                key={n}
                className={`cell total-cell ${isHigh ? 'high' : ''} ${isLow ? 'low' : ''}`}
                style={{ '--intensity': count / maxCount } as React.CSSProperties}
              >
                {count}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};