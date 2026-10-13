import React from 'react';
import { Copy, Check, Dices, Clock } from 'lucide-react';
import type { LogoutCalculation } from '../utils/timeCalc';
import type { LogoutEmoji } from '../utils/emojis';

interface LogoutResultCardProps {
  calculation: LogoutCalculation | null;
  emoji: LogoutEmoji;
  onRerollEmoji: () => void;
  onCopyLogoutTime: () => void;
  isCopied: boolean;
}

export const LogoutResultCard: React.FC<LogoutResultCardProps> = ({
  calculation,
  emoji,
  onRerollEmoji,
  onCopyLogoutTime,
  isCopied,
}) => {
  if (!calculation) {
    return (
      <div
        className="linear-card"
        style={{
          padding: 'var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '220px',
          color: 'var(--color-muted)',
          textAlign: 'center',
          gap: 'var(--space-2)',
        }}
      >
        <Clock size={28} style={{ opacity: 0.4, color: 'var(--color-brand)' }} />
        <span className="text-h2" style={{ color: 'var(--color-muted)', fontSize: '15px' }}>
          Enter your login time above
        </span>
        <span style={{ fontSize: '12px', maxWidth: '300px' }}>
          Type any format like <code style={{ color: 'var(--color-text)' }}>10 45</code> or <code style={{ color: 'var(--color-text)' }}>9;54</code> to compute your punch-out hour instantly.
        </span>
      </div>
    );
  }

  const {
    loginTime12,
    logoutTime12,
    logoutTime24,
    workHoursFormatted,
    breakMinutes,
    isNextDay,
    isCompleted,
    isInProgress,
    progressPercent,
    remainingFormatted,
    elapsedFormatted,
  } = calculation;

  return (
    <div
      className="linear-card"
      style={{
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        position: 'relative',
        overflow: 'hidden',
        borderLeft: isCompleted
          ? '3px solid var(--color-urgent)'
          : '3px solid var(--color-brand)',
      }}
    >
      {/* Top row: Status pill & quick copy action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 8px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '11px',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              backgroundColor: isCompleted
                ? 'var(--color-urgent-bg)'
                : isInProgress
                ? 'var(--color-brand-subtle)'
                : 'var(--color-surface-subtle)',
              color: isCompleted
                ? 'var(--color-urgent)'
                : isInProgress
                ? 'var(--color-brand)'
                : 'var(--color-muted)',
              border: `1px solid ${
                isCompleted
                  ? 'var(--color-urgent)'
                  : isInProgress
                  ? 'var(--color-brand-border)'
                  : 'var(--color-border)'
              }`,
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: isCompleted
                  ? 'var(--color-urgent)'
                  : isInProgress
                  ? 'var(--color-brand)'
                  : 'var(--color-muted)',
              }}
            />
            {isCompleted
              ? 'Shift Complete'
              : isInProgress
              ? `${remainingFormatted} left`
              : 'Shift Scheduled'}
          </span>

          {isNextDay && (
            <span
              className="kbd-badge"
              style={{ color: 'var(--color-urgent)', borderColor: 'var(--color-urgent)' }}
            >
              +1 Next Day
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onCopyLogoutTime}
          className="btn-secondary"
          title="Copy logout time to clipboard [C]"
          style={{ height: '28px', padding: '0 8px', fontSize: '12px' }}
        >
          {isCopied ? (
            <>
              <Check size={13} style={{ color: 'var(--color-brand)' }} />
              <span style={{ color: 'var(--color-brand)' }}>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copy Time</span>
              <span className="kbd-badge">C</span>
            </>
          )}
        </button>
      </div>

      {/* Hero Display: Big Time & Random Emoji */}
      <div className="result-hero-row">
        <div>
          <span
            className="text-label"
            style={{
              color: 'var(--color-muted)',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '2px',
            }}
          >
            Official Logout Time
          </span>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(28px, 6vw, 38px)',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: 'var(--color-text)',
            }}
          >
            {logoutTime12}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: 'var(--color-muted)',
              marginTop: '4px',
            }}
          >
            24h format: <span style={{ color: 'var(--color-text)' }}>{logoutTime24}</span>
          </div>
        </div>

        {/* Random Emoji Showcase */}
        <div
          onClick={onRerollEmoji}
          title="Click to roll another off-time emoji [R]"
          className="result-emoji-box"
        >
          <div className="emoji-symbol" style={{ fontSize: '32px', lineHeight: 1 }}>{emoji.emoji}</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--color-text)',
                textAlign: 'center',
              }}
            >
              {emoji.name}
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '10px',
                color: 'var(--color-muted)',
              }}
            >
              <Dices size={11} />
              <span>Reroll</span>
              <span className="kbd-badge" style={{ fontSize: '9px', padding: '0 3px' }}>R</span>
            </div>
          </div>
        </div>
      </div>

      {/* Emoji Punchline Banner */}
      <div
        style={{
          padding: '6px 10px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--color-surface-subtle)',
          border: '1px solid var(--color-border-subtle)',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
        }}
      >
        <span style={{ fontSize: '14px' }}>{emoji.emoji}</span>
        <span style={{ color: 'var(--color-muted)' }}>
          <strong style={{ color: 'var(--color-text)' }}>{emoji.mood}:</strong> {emoji.punchline}
        </span>
      </div>

      {/* Progress Bar & Countdown */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '6px',
            fontSize: '12px',
          }}
        >
          <span style={{ color: 'var(--color-muted)' }}>
            Workday Progress: <strong style={{ color: 'var(--color-text)' }}>{progressPercent}%</strong>
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-muted)' }}>
            {elapsedFormatted} done / {remainingFormatted}
          </span>
        </div>

        {/* Progress Track */}
        <div
          style={{
            height: '6px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-surface-subtle)',
            overflow: 'hidden',
            border: '1px solid var(--color-border-subtle)',
            position: 'relative',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              backgroundColor: isCompleted ? 'var(--color-urgent)' : 'var(--color-brand)',
              transition: 'width var(--transition-fast)',
            }}
          />
        </div>
      </div>

      {/* Linear Metric Summary Grid */}
      <div className="summary-metrics-grid">
        <div className="linear-row" style={{ flexDirection: 'column', alignItems: 'flex-start', height: 'auto', padding: '6px 8px' }}>
          <span className="text-label" style={{ color: 'var(--color-muted)', fontSize: '10px' }}>LOGIN</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600 }}>{loginTime12}</span>
        </div>

        <div className="linear-row" style={{ flexDirection: 'column', alignItems: 'flex-start', height: 'auto', padding: '6px 8px' }}>
          <span className="text-label" style={{ color: 'var(--color-muted)', fontSize: '10px' }}>SHIFT</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600 }}>
            {workHoursFormatted} {breakMinutes > 0 ? `(+${breakMinutes}m)` : ''}
          </span>
        </div>

        <div className="linear-row" style={{ flexDirection: 'column', alignItems: 'flex-start', height: 'auto', padding: '6px 8px' }}>
          <span className="text-label" style={{ color: 'var(--color-muted)', fontSize: '10px' }}>LOGOUT</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, color: 'var(--color-brand)' }}>
            {logoutTime12}
          </span>
        </div>
      </div>
    </div>
  );
};
