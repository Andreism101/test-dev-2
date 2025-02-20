'use client';
import React, { useState, useMemo } from 'react';
import { LOTTERY_CONFIG, LotteryType } from './lottery-config';
import { generateNumberRange } from './lottery-utils';
import Image from 'next/image';
import fireBall from '../public/fire-ball2.png';
import fireBallStyles from './FireBall.module.css'; // Adjust the path as needed

interface LotteryMatrixProps {
  data: Array<{ id: string; numbers: number[]; date: string }>;
  type: LotteryType;
}

export const LotteryMatrix = ({ data, type }: LotteryMatrixProps) => {
  const [sortOrder, setSortOrder] = useState<'normal' | 'reversed'>('normal');
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

  // Create a base sorted order (highest frequency to lowest)
  const baseSortedNumbers = useMemo(() =>
    [...allNumbers].sort((a, b) =>
      (numberCounts.get(b) || 0) - (numberCounts.get(a) || 0)
    ),
    [allNumbers, numberCounts]
  );

  // Reverse the order if the sortOrder is 'reversed'
  const sortedNumbers = useMemo(() =>
    sortOrder === 'normal' ? baseSortedNumbers : [...baseSortedNumbers].reverse(),
    [baseSortedNumbers, sortOrder]
  );

  // Get top and low numbers based on config
  const { topCount, lowCount } = config;
  const [topNumbers, lowNumbers] = useMemo(() => [
    new Set(baseSortedNumbers.slice(0, topCount)),
    new Set(baseSortedNumbers.slice(-lowCount))
  ], [baseSortedNumbers, topCount, lowCount]);

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
                className={`cell number-label ball ${isHigh ? 'high' : ''} ${isLow ? 'low' : ''}`}
              >
                <div
                  className={fireBallStyles.container}
                  style={
                    {
                      '--number-left': (['3DL', '4DL', '5DL'].includes(type)) ? '17px' : '12px'
                    } as React.CSSProperties
                  }
                >
                  <span>{config.formatNumber(n)}</span>
                  {isLow && (
                    <div className="falling-snow">
                      <div className="snowflake"></div>
                      <div className="snowflake"></div>
                      <div className="snowflake"></div>
                      <div className="snowflake"></div>
                      <div className="snowflake"></div>
                      <div className="snowflake"></div>
                      <div className="snowflake"></div>
                      <div className="snowflake"></div>
                    </div>
                  )}
                </div>
              </span>
            );
          })}
        </div>

        {/* Toggle Button for expanding columns */}
        <button
          className="toggle-button"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          ⇆
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
            onClick={() => setSortOrder(prev => prev === 'normal' ? 'reversed' : 'normal')}
          >
            Totals {sortOrder === 'normal' ? '↓' : '↑'}
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
