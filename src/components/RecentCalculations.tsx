import React from 'react';
import { History, Trash2, ArrowUpRight } from 'lucide-react';
import type { CalculationHistoryItem } from '../types';

interface RecentCalculationsProps {
  history: CalculationHistoryItem[];
  onSelectHistoryItem: (item: CalculationHistoryItem) => void;
  onClearHistory: () => void;
}

export const RecentCalculations: React.FC<RecentCalculationsProps> = ({
  history,
  onSelectHistoryItem,
  onClearHistory,
}) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div
      className="linear-card"
      style={{
        padding: 'var(--space-3) var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <History size={13} style={{ color: 'var(--color-muted)' }} />
          <span className="text-label" style={{ color: 'var(--color-muted)', textTransform: 'uppercase' }}>
            Recent Shifts
          </span>
        </div>

        <button
          type="button"
          onClick={onClearHistory}
          title="Clear history"
          style={{
            fontSize: '11px',
            color: 'var(--color-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
          }}
        >
          <Trash2 size={11} />
          <span>Clear</span>
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {history.slice(0, 4).map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectHistoryItem(item)}
            className="linear-row"
            style={{
              justifyContent: 'space-between',
              height: '32px',
              padding: '0 8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span>{item.emoji}</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text)' }}>
                In: {item.loginTime12}
              </span>
              <span style={{ color: 'var(--color-muted)' }}>({item.workHoursInput})</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-brand)' }}>
                Out: {item.logoutTime12}
              </span>
              <ArrowUpRight size={12} style={{ color: 'var(--color-muted)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
