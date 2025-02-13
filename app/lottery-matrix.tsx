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

  // Create sorted totals
  const sortedNumbers = useMemo(() => {
    return [...allNumbers].sort((a, b) => {
      const countA = numberCounts.get(a) || 0;
      const countB = numberCounts.get(b) || 0;
      return sortOrder === 'desc' ? countB - countA : countA - countB;
    });
  }, [allNumbers, numberCounts, sortOrder]);

  const maxCount = useMemo(() => 
    Math.max(...Array.from(numberCounts.values())),
    [numberCounts]
  );

  return (
    <div className="lottery-matrix">
        <div className="matrix-container">
            {/* Column Headers */}
            <div className="matrix-column headers">
                <div className="cell header-cell">Numbers</div>
                {sortedNumbers.map(n => (
                    <span key={n} className="cell number-label">
                      <span>
                        {config.formatNumber(n)}
                      </span>
                    </span>
                ))}
            </div>

            {/* Data Columns */}
            {data.map(entry => (
                <div key={entry.id} className="matrix-column">
                    <div className="cell header-cell">{entry.date}</div>
                    {sortedNumbers.map(n => (
                    <div key={n} className="cell">
                        {entry.numbers.includes(n) && (
                        <span className="text-3xl">❌</span>
                        )}
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
                return (
                <div 
                    key={n}
                    className="cell total-cell"
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