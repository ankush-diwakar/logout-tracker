import React, { useState, useEffect } from 'react';
import { Mascot } from 'page-mascot';
import { MessageSquare, Sparkles, Heart, RefreshCw } from 'lucide-react';
import type { MascotCharacter } from '../types';

interface MascotDeskCompanionProps {
  character: MascotCharacter;
  commentary: string;
  onNextCharacter: () => void;
  characterListLength: number;
}

export const MascotDeskCompanion: React.FC<MascotDeskCompanionProps> = ({
  character,
  commentary,
  onNextCharacter,
}) => {
  const [boopCount, setBoopCount] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth <= 600 : false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleBoop = () => {
    setBoopCount((prev) => prev + 1);
  };

  return (
    <div
      className="linear-card mascot-companion-card"
      style={{
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-3)',
        position: 'relative',
        minHeight: isMobile ? '240px' : '280px',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Sparkles size={14} style={{ color: 'var(--color-brand)' }} />
          <span className="text-label" style={{ color: 'var(--color-text)', textTransform: 'uppercase' }}>
            Desk Companion
          </span>
        </div>

        <button
          type="button"
          onClick={onNextCharacter}
          className="btn-secondary"
          title="Switch character [M]"
          style={{ height: '24px', padding: '0 6px', fontSize: '11px' }}
        >
          <RefreshCw size={11} />
          <span>{character.name}</span>
          <span className="kbd-badge" style={{ fontSize: '9px' }}>M</span>
        </button>
      </div>

      {/* Mascot Speech Bubble */}
      <div
        style={{
          width: '100%',
          padding: '8px 12px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-surface-subtle)',
          border: '1px solid var(--color-border)',
          fontSize: '12px',
          lineHeight: 1.4,
          color: 'var(--color-text)',
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 'var(--space-2)',
          boxShadow: 'var(--shadow-subtle)',
        }}
      >
        <MessageSquare
          size={14}
          style={{ color: 'var(--color-brand)', marginTop: '2px', flexShrink: 0 }}
        />
        <span>{commentary}</span>
      </div>

      {/* The Interactive page-mascot */}
      <div
        onClick={handleBoop}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          padding: '4px',
          position: 'relative',
        }}
        title="Click or tap to boop!"
      >
        <Mascot
          directions={character.directions}
          reactions={character.reactions}
          size={isMobile ? 120 : 140}
          label={character.name}
        />
      </div>

      {/* Footer Info */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: 'var(--color-muted)',
          paddingTop: 'var(--space-2)',
          borderTop: '1px solid var(--color-border-subtle)',
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <span>{isMobile ? 'Interactive mascot · Tap to boop!' : 'Watches cursor · Click to boop'}</span>
        </span>

        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <Heart size={11} style={{ color: 'var(--color-high)' }} />
          <span>{boopCount} {boopCount === 1 ? 'boop' : 'boops'}</span>
        </span>
      </div>
    </div>
  );
};
