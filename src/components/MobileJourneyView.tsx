import React, { useState } from 'react';
import { Mascot } from 'page-mascot';
import { Menu, Zap, Check, Copy, ArrowRight, ArrowLeft, Dices, RotateCcw } from 'lucide-react';
import type { MascotCharacter } from '../types';
import type { LogoutCalculation } from '../utils/timeCalc';
import type { LogoutEmoji } from '../utils/emojis';
import type { ParsedTime } from '../utils/timeParser';

interface MobileJourneyViewProps {
  currentStep: number; // 1, 2, 3
  onSetStep: (step: number) => void;
  activeCharacter: MascotCharacter;
  loginInput: string;
  onChangeLoginInput: (val: string) => void;
  parsedTime?: ParsedTime;
  loginError?: string;
  onSetCurrentTime: () => void;
  workPreset: string;
  onSelectPreset: (preset: string) => void;
  customWorkInput: string;
  onChangeCustomWork: (val: string) => void;
  breakMinutes: number;
  onChangeBreakMinutes: (mins: number) => void;
  effectiveWorkFormatted: string;
  calculation: LogoutCalculation | null;
  logoutEmoji: LogoutEmoji;
  onRerollEmoji: () => void;
  onCopyLogoutTime: () => void;
  isCopied: boolean;
  onOpenMenu: () => void;
}

const PRESETS = [
  { id: '8.5', label: '8.5h' },
  { id: '4.5', label: '4.5h' },
  { id: '8.0', label: '8.0h' },
  { id: '9.0', label: '9.0h' },
  { id: 'custom', label: 'Custom' },
];

const BREAKS = [
  { mins: 0, label: '0m' },
  { mins: 30, label: '+30m' },
  { mins: 45, label: '+45m' },
  { mins: 60, label: '+1h' },
];

export const MobileJourneyView: React.FC<MobileJourneyViewProps> = ({
  currentStep,
  onSetStep,
  activeCharacter,
  loginInput,
  onChangeLoginInput,
  parsedTime,
  loginError,
  onSetCurrentTime,
  workPreset,
  onSelectPreset,
  customWorkInput,
  onChangeCustomWork,
  breakMinutes,
  onChangeBreakMinutes,
  effectiveWorkFormatted,
  calculation,
  logoutEmoji,
  onRerollEmoji,
  onCopyLogoutTime,
  isCopied,
  onOpenMenu,
}) => {
  const [boopCount, setBoopCount] = useState<number>(0);

  // Mascot dynamic speech bubble
  const getSpeechBubble = () => {
    if (currentStep === 1) {
      if (parsedTime) {
        return `Clocked in at ${parsedTime.formatted12}? Tap continue! 👇`;
      }
      return 'What time did you login today? Type any format below!';
    }
    if (currentStep === 2) {
      return `Targeting ${effectiveWorkFormatted}. Tap calculate when ready! ⏱️`;
    }
    if (calculation) {
      if (calculation.isCompleted) {
        return `Shift completed! You're clear to logout! 🏃💨`;
      }
      return `Off at ${calculation.logoutTime12}! ${calculation.remainingFormatted} left. ${logoutEmoji.emoji}`;
    }
    return 'Calculating departure...';
  };

  return (
    <div className="mobile-view">
      <div className="mobile-journey-shell">
        {/* Top Header: Step Indicator & Hamburger Menu (NO LOGO) */}
        <div className="mobile-nav-bar">
          <div className="mobile-steps-tracker">
            <button
              type="button"
              onClick={() => onSetStep(1)}
              className={`mobile-step-pill ${currentStep === 1 ? 'active' : ''}`}
            >
              1. Login
            </button>
            <span style={{ color: 'var(--color-border)', fontSize: '10px' }}>/</span>
            <button
              type="button"
              onClick={() => {
                if (parsedTime) onSetStep(2);
              }}
              className={`mobile-step-pill ${currentStep === 2 ? 'active' : ''}`}
            >
              2. Shift
            </button>
            <span style={{ color: 'var(--color-border)', fontSize: '10px' }}>/</span>
            <button
              type="button"
              onClick={() => {
                if (calculation) onSetStep(3);
              }}
              className={`mobile-step-pill ${currentStep === 3 ? 'active' : ''}`}
            >
              3. Off
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenMenu}
            className="btn-secondary"
            style={{ width: '34px', height: '34px', padding: 0 }}
            title="Open Extras Menu"
          >
            <Menu size={16} />
          </button>
        </div>

        {/* Mascot Center Stage — ALWAYS VISIBLE */}
        <div className="mobile-mascot-container">
          <div className="mobile-speech-bubble">
            {getSpeechBubble()}
          </div>

          <div
            onClick={() => setBoopCount((prev) => prev + 1)}
            style={{ cursor: 'pointer', padding: '2px', display: 'flex', justifyContent: 'center' }}
            title="Tap mascot to boop!"
          >
            <Mascot
              directions={activeCharacter.directions}
              reactions={activeCharacter.reactions}
              size={100}
              label={activeCharacter.name}
            />
          </div>

          <span style={{ fontSize: '10px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
            {boopCount > 0 ? `Boops: ${boopCount}` : 'Tap mascot to boop'}
          </span>
        </div>

        {/* Step-by-Step Card (Lower Half) */}
        <div className="mobile-step-card">
          {/* STEP 1: Login Time */}
          {currentStep === 1 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="text-label" style={{ color: 'var(--color-text)', textTransform: 'uppercase' }}>
                  Enter Login Time
                </span>

                <button
                  type="button"
                  onClick={onSetCurrentTime}
                  className="btn-secondary"
                  style={{ height: '26px', padding: '0 8px', fontSize: '11px' }}
                >
                  <Zap size={11} />
                  <span>Now</span>
                </button>
              </div>

              <div>
                <input
                  type="text"
                  value={loginInput}
                  onChange={(e) => onChangeLoginInput(e.target.value)}
                  placeholder="e.g. 10 45, 10:45, 9;54, 10/45..."
                  className="linear-input"
                  style={{
                    height: '42px',
                    fontSize: '16px',
                    borderColor: loginError ? 'var(--color-muted)' : parsedTime ? 'var(--color-brand)' : 'var(--color-border)',
                  }}
                  autoFocus
                />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                  {parsedTime ? (
                    <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-text)', fontWeight: 600 }}>
                      ✓ {parsedTime.formatted12} ({parsedTime.formatted24})
                    </span>
                  ) : (
                    <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>
                      Any format (10 45, 10:45, 9;54)
                    </span>
                  )}

                  <div style={{ display: 'flex', gap: '4px' }}>
                    {['10 45', '9;54'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => onChangeLoginInput(s)}
                        style={{
                          fontSize: '10px',
                          fontFamily: 'var(--font-mono)',
                          padding: '2px 6px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--color-surface-subtle)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-muted)',
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (parsedTime) onSetStep(2);
                }}
                disabled={!parsedTime}
                className="btn-primary"
                style={{ width: '100%', opacity: parsedTime ? 1 : 0.5 }}
              >
                <span>Continue to Shift Hours</span>
                <ArrowRight size={14} />
              </button>
            </>
          )}

          {/* STEP 2: Shift Duration */}
          {currentStep === 2 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="text-label" style={{ color: 'var(--color-text)', textTransform: 'uppercase' }}>
                  Select Shift Hours
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-brand)', fontWeight: 600 }}>
                  {effectiveWorkFormatted}
                </span>
              </div>

              {/* Presets */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
                {PRESETS.map((p) => {
                  const isSelected = workPreset === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => onSelectPreset(p.id)}
                      className="linear-card"
                      style={{
                        padding: '6px 2px',
                        fontSize: '12px',
                        fontWeight: isSelected ? 600 : 400,
                        backgroundColor: isSelected ? 'var(--color-brand)' : 'var(--color-surface-subtle)',
                        color: isSelected ? 'var(--color-brand-text)' : 'var(--color-text)',
                        borderColor: isSelected ? 'var(--color-brand)' : 'var(--color-border)',
                        textAlign: 'center',
                      }}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>

              {/* Custom Input */}
              {workPreset === 'custom' && (
                <input
                  type="text"
                  value={customWorkInput}
                  onChange={(e) => onChangeCustomWork(e.target.value)}
                  placeholder="e.g. 7.5, 6:30, 8h 15m..."
                  className="linear-input"
                  style={{ height: '34px', fontSize: '14px' }}
                  autoFocus
                />
              )}

              {/* Breaks */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px', borderTop: '1px solid var(--color-border-subtle)' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>Break:</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {BREAKS.map((b) => (
                    <button
                      key={b.mins}
                      type="button"
                      onClick={() => onChangeBreakMinutes(b.mins)}
                      style={{
                        padding: '2px 6px',
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: breakMinutes === b.mins ? 'var(--color-brand)' : 'var(--color-surface-subtle)',
                        color: breakMinutes === b.mins ? 'var(--color-brand-text)' : 'var(--color-muted)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mobile-nav-buttons">
                <button
                  type="button"
                  onClick={() => onSetStep(1)}
                  className="btn-secondary"
                >
                  <ArrowLeft size={13} />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSetStep(3)}
                  className="btn-primary"
                >
                  <span>See Logout Time</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </>
          )}

          {/* STEP 3: Logout Time Result */}
          {currentStep === 3 && calculation && (
            <>
              {/* Header & Status */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="text-label" style={{ color: 'var(--color-muted)', textTransform: 'uppercase' }}>
                  Official Departure Time
                </span>
                <span
                  style={{
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-surface-subtle)',
                  }}
                >
                  {calculation.isCompleted ? 'Shift Done' : `${calculation.remainingFormatted} left`}
                </span>
              </div>

              {/* Large Departure Time & Emoji */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '34px',
                      fontWeight: 700,
                      lineHeight: 1,
                      letterSpacing: '-0.02em',
                      color: 'var(--color-text)',
                    }}
                  >
                    {calculation.logoutTime12}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-muted)', marginTop: '2px' }}>
                    In: {calculation.loginTime12} · Shift: {calculation.workHoursFormatted}
                  </div>
                </div>

                {/* Random Emoji Tap Box */}
                <div
                  onClick={onRerollEmoji}
                  style={{
                    padding: '4px 10px',
                    backgroundColor: 'var(--color-surface-subtle)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                  }}
                  title="Tap to reroll emoji"
                >
                  <span style={{ fontSize: '24px' }}>{logoutEmoji.emoji}</span>
                  <Dices size={13} style={{ color: 'var(--color-muted)' }} />
                </div>
              </div>

              {/* Progress Track */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--color-muted)', marginBottom: '3px' }}>
                  <span>Progress: {calculation.progressPercent}%</span>
                  <span>{calculation.remainingFormatted}</span>
                </div>
                <div
                  style={{
                    height: '4px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-surface-subtle)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${calculation.progressPercent}%`,
                      backgroundColor: 'var(--color-brand)',
                    }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="mobile-nav-buttons">
                <button
                  type="button"
                  onClick={() => onSetStep(1)}
                  className="btn-secondary"
                  style={{ flex: 1 }}
                >
                  <RotateCcw size={12} />
                  <span>Adjust</span>
                </button>

                <button
                  type="button"
                  onClick={onCopyLogoutTime}
                  className="btn-primary"
                  style={{ flex: 1.5 }}
                >
                  {isCopied ? (
                    <>
                      <Check size={14} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy Time</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
