import React, { useRef } from 'react';
import { Clock, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import type { ParsedTime } from '../utils/timeParser';

interface LoginTimeInputProps {
  value: string;
  onChange: (val: string) => void;
  parsedTime?: ParsedTime;
  errorMessage?: string;
  onSetCurrentTime: () => void;
  onTogglePeriod?: () => void;
}

const SAMPLE_FORMATS = ['10 45', '10:45', '10/45', '9;54', '09 54', '8:30 AM', '11 00'];

export const LoginTimeInput: React.FC<LoginTimeInputProps> = ({
  value,
  onChange,
  parsedTime,
  errorMessage,
  onSetCurrentTime,
  onTogglePeriod,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="linear-card"
      style={{
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Clock size={15} style={{ color: 'var(--color-brand)' }} />
          <span className="text-label" style={{ color: 'var(--color-text)', textTransform: 'uppercase' }}>
            1. Login Time
          </span>
        </div>

        <button
          type="button"
          onClick={onSetCurrentTime}
          className="btn-secondary"
          title="Use current clock time [N]"
          style={{ height: '26px', padding: '0 8px', fontSize: '12px' }}
        >
          <Zap size={12} style={{ color: 'var(--color-urgent)' }} />
          <span>Use Now</span>
          <span className="kbd-badge">N</span>
        </button>
      </div>

      {/* Main input wrapper */}
      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter time (e.g. 10 45, 10:45, 9;54, 10/45...)"
          className="linear-input"
          style={{
            height: '42px',
            fontSize: '16px',
            paddingRight: parsedTime ? '110px' : 'var(--space-3)',
            borderColor: errorMessage ? 'var(--color-high)' : parsedTime ? 'var(--color-brand)' : 'var(--color-border)',
          }}
          autoFocus
        />

        {/* Right side period badge & status */}
        {parsedTime && (
          <div
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {onTogglePeriod && (
              <button
                type="button"
                onClick={onTogglePeriod}
                title="Click to toggle AM / PM"
                style={{
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-brand-subtle)',
                  border: '1px solid var(--color-brand-border)',
                  color: 'var(--color-brand)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 600,
                }}
              >
                {parsedTime.period} ⇋
              </button>
            )}
            <CheckCircle2 size={16} style={{ color: 'var(--color-brand)' }} />
          </div>
        )}
      </div>

      {/* Interpretation feedback row */}
      {parsedTime ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 8px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-surface-subtle)',
            fontSize: '12px',
            color: 'var(--color-muted)',
            flexWrap: 'wrap',
            gap: '4px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <span>Recognized as:</span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-text)',
                fontWeight: 600,
              }}
            >
              {parsedTime.formatted12}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}>
              ({parsedTime.formatted24})
            </span>
          </div>

          <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>
            Auto-detected format
          </span>
        </div>
      ) : errorMessage ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: '6px 8px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-high-bg)',
            color: 'var(--color-high)',
            fontSize: '12px',
          }}
        >
          <AlertCircle size={14} />
          <span>{errorMessage}</span>
        </div>
      ) : null}

      {/* Quick format chip examples */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>Quick try:</span>
        {SAMPLE_FORMATS.map((sample) => (
          <button
            key={sample}
            type="button"
            onClick={() => onChange(sample)}
            className="linear-row"
            style={{
              height: '28px',
              padding: '0 8px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-surface-subtle)',
              border: '1px solid var(--color-border)',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--color-muted)',
            }}
          >
            {sample}
          </button>
        ))}
      </div>
    </div>
  );
};
