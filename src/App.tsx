import { useState, useEffect, useMemo, useCallback } from 'react';
import { LinearNavbar } from './components/LinearNavbar';
import { LoginTimeInput } from './components/LoginTimeInput';
import { WorkHoursSelector } from './components/WorkHoursSelector';
import { LogoutResultCard } from './components/LogoutResultCard';
import { MascotDeskCompanion } from './components/MascotDeskCompanion';
import { RecentCalculations } from './components/RecentCalculations';
import { ShortcutsModal } from './components/ShortcutsModal';
import { MobileJourneyView } from './components/MobileJourneyView';
import { MobileDrawer } from './components/MobileDrawer';
import { parseFlexibleTime, parseWorkingHours } from './utils/timeParser';
import { calculateLogoutTime } from './utils/timeCalc';
import type { LogoutCalculation } from './utils/timeCalc';
import { getRandomLogoutEmoji, getMascotCommentary } from './utils/emojis';
import type { LogoutEmoji } from './utils/emojis';
import type { ThemeMode, MascotCharacter, CalculationHistoryItem } from './types';

const CHARACTERS: MascotCharacter[] = [
  {
    id: 'fox',
    name: 'Fox',
    tagline: 'Curious & sharp timekeeper',
    directions: '/mascots/fox/directions.png',
    reactions: '/mascots/fox/reactions.png',
  },
  {
    id: 'clockwork',
    name: 'Clockwork',
    tagline: 'Precision mechanical buddy',
    directions: '/mascots/clockwork/directions.png',
    reactions: '/mascots/clockwork/reactions.png',
  },
  {
    id: 'cat',
    name: 'Cat',
    tagline: 'Chill nap enthusiast',
    directions: '/mascots/cat/directions.png',
    reactions: '/mascots/cat/reactions.png',
  },
];

export function App() {
  // Theme state: monochrome dark-first as specified
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('off_logout_theme');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  // Current clock time state (updates every second for real-time progress)
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Input states
  const [loginInput, setLoginInput] = useState<string>('10 45');
  const [preferPeriod, setPreferPeriod] = useState<'AM' | 'PM'>('AM');
  const [workPreset, setWorkPreset] = useState<string>('8.5');
  const [customWorkInput, setCustomWorkInput] = useState<string>('8.5');
  const [breakMinutes, setBreakMinutes] = useState<number>(0);

  // Mobile Journey State (1: Login, 2: Shift, 3: Departure)
  const [mobileStep, setMobileStep] = useState<number>(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Mascot and Emoji states
  const [activeCharacter, setActiveCharacter] = useState<MascotCharacter>(CHARACTERS[0]);
  const [logoutEmoji, setLogoutEmoji] = useState<LogoutEmoji>(() => getRandomLogoutEmoji());
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);

  // Recent history in localStorage
  const [history, setHistory] = useState<CalculationHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('off_logout_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Update document theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('off_logout_theme', theme);
  }, [theme]);

  // Keep live time ticking
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format current time string (HH:MM:SS AM/PM)
  const currentTimeString = useMemo(() => {
    const h = currentDate.getHours();
    const m = currentDate.getMinutes();
    const s = currentDate.getSeconds();
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} ${period}`;
  }, [currentDate]);

  // Parse login time input
  const parseResult = useMemo(() => {
    return parseFlexibleTime(loginInput, preferPeriod);
  }, [loginInput, preferPeriod]);

  // Parse working hours
  const workHoursResult = useMemo(() => {
    if (workPreset === 'custom') {
      return parseWorkingHours(customWorkInput);
    }
    const val = parseFloat(workPreset);
    return parseWorkingHours(val);
  }, [workPreset, customWorkInput]);

  // Calculate logout time & progress
  const calculation: LogoutCalculation | null = useMemo(() => {
    if (!parseResult.success || !parseResult.time || !workHoursResult.isValid) {
      return null;
    }
    return calculateLogoutTime(
      parseResult.time.hours,
      parseResult.time.minutes,
      workHoursResult.totalMinutes,
      breakMinutes,
      currentDate
    );
  }, [parseResult, workHoursResult, breakMinutes, currentDate]);

  // Mascot commentary
  const mascotCommentary = useMemo(() => {
    if (!calculation) {
      return "Hello! Enter your login time above (e.g. 10 45 or 9;54) and I'll calculate when you can clock out! 👀";
    }
    return getMascotCommentary(
      calculation.progressPercent,
      calculation.remainingFormatted,
      calculation.logoutTime12,
      calculation.isCompleted,
      calculation.isUpcoming
    );
  }, [calculation]);

  // Save to history callback
  const recordHistory = useCallback(() => {
    if (!calculation) return;
    const newItem: CalculationHistoryItem = {
      id: `${calculation.loginTime12}-${calculation.workMinutes}-${Date.now()}`,
      loginInput,
      workHoursInput: workHoursResult.display,
      loginTime12: calculation.loginTime12,
      logoutTime12: calculation.logoutTime12,
      emoji: logoutEmoji.emoji,
      timestamp: Date.now(),
    };

    setHistory((prev) => {
      if (prev.length > 0 && prev[0].loginTime12 === newItem.loginTime12 && prev[0].logoutTime12 === newItem.logoutTime12) {
        return prev;
      }
      const updated = [newItem, ...prev.filter(h => h.loginTime12 !== newItem.loginTime12)].slice(0, 5);
      try {
        localStorage.setItem('off_logout_history', JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to save history', err);
      }
      return updated;
    });
  }, [calculation, loginInput, workHoursResult.display, logoutEmoji.emoji]);

  // Quick action: Use Current Time
  const handleSetCurrentTime = useCallback(() => {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const formatted = `${h}:${m.toString().padStart(2, '0')}`;
    setLoginInput(formatted);
    setPreferPeriod(h >= 12 ? 'PM' : 'AM');
  }, []);

  // Toggle AM / PM
  const handleTogglePeriod = useCallback(() => {
    setPreferPeriod((prev) => (prev === 'AM' ? 'PM' : 'AM'));
  }, []);

  // Reroll Emoji
  const handleRerollEmoji = useCallback(() => {
    setLogoutEmoji(getRandomLogoutEmoji(logoutEmoji.emoji));
  }, [logoutEmoji.emoji]);

  // Next Character
  const handleNextCharacter = useCallback(() => {
    const currentIndex = CHARACTERS.findIndex((c) => c.id === activeCharacter.id);
    const nextIndex = (currentIndex + 1) % CHARACTERS.length;
    setActiveCharacter(CHARACTERS[nextIndex]);
  }, [activeCharacter.id]);

  // Copy logout time
  const handleCopyLogoutTime = useCallback(() => {
    if (!calculation) return;
    recordHistory();
    const textToCopy = `Official logout time: ${calculation.logoutTime12} (${calculation.logoutTime24}) ${logoutEmoji.emoji}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, [calculation, logoutEmoji.emoji, recordHistory]);

  // Keyboard Shortcuts Listener (Desktop)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') {
        if (e.key === 'Escape') {
          (e.target as HTMLElement).blur();
        }
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 'd') {
        e.preventDefault();
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
      } else if (key === 'n') {
        e.preventDefault();
        handleSetCurrentTime();
      } else if (key === '1') {
        e.preventDefault();
        setWorkPreset('8.5');
      } else if (key === '2') {
        e.preventDefault();
        setWorkPreset('4.5');
      } else if (key === '3') {
        e.preventDefault();
        setWorkPreset('8.0');
      } else if (key === '4') {
        e.preventDefault();
        setWorkPreset('9.0');
      } else if (key === '5') {
        e.preventDefault();
        setWorkPreset('custom');
      } else if (key === 'r') {
        e.preventDefault();
        handleRerollEmoji();
      } else if (key === 'c') {
        e.preventDefault();
        handleCopyLogoutTime();
      } else if (key === 'm') {
        e.preventDefault();
        handleNextCharacter();
      } else if (key === '?') {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSetCurrentTime, handleRerollEmoji, handleCopyLogoutTime, handleNextCharacter]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ========================================================
          MOBILE VIEW: Single Screen No-Scroll Journey
          ======================================================== */}
      <MobileJourneyView
        currentStep={mobileStep}
        onSetStep={setMobileStep}
        activeCharacter={activeCharacter}
        loginInput={loginInput}
        onChangeLoginInput={setLoginInput}
        parsedTime={parseResult.time}
        loginError={parseResult.error}
        onSetCurrentTime={handleSetCurrentTime}
        workPreset={workPreset}
        onSelectPreset={setWorkPreset}
        customWorkInput={customWorkInput}
        onChangeCustomWork={setCustomWorkInput}
        breakMinutes={breakMinutes}
        onChangeBreakMinutes={setBreakMinutes}
        effectiveWorkFormatted={workHoursResult.display}
        calculation={calculation}
        logoutEmoji={logoutEmoji}
        onRerollEmoji={handleRerollEmoji}
        onCopyLogoutTime={handleCopyLogoutTime}
        isCopied={isCopied}
        onOpenMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* Mobile Extras Drawer (Slide-up menu) */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeCharacter={activeCharacter}
        availableCharacters={CHARACTERS}
        onSelectCharacter={setActiveCharacter}
        theme={theme}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        history={history}
        onSelectHistoryItem={(item) => {
          setLoginInput(item.loginInput);
          setMobileStep(3);
        }}
        onClearHistory={() => {
          setHistory([]);
          localStorage.removeItem('off_logout_history');
        }}
        onResetJourney={() => {
          setMobileStep(1);
        }}
      />

      {/* ========================================================
          DESKTOP VIEW: Full Monochrome Linear Dashboard
          ======================================================== */}
      <div className="desktop-view" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Linear Header */}
        <LinearNavbar
          theme={theme}
          onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
          activeCharacter={activeCharacter}
          availableCharacters={CHARACTERS}
          onSelectCharacter={(char) => setActiveCharacter(char)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          currentTimeString={currentTimeString}
        />

        {/* Main Workspace Layout */}
        <main className="app-container">
          {/* App Title Banner */}
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: '4px' }}>
              <span
                className="kbd-badge"
                style={{
                  backgroundColor: 'var(--color-brand-subtle)',
                  color: 'var(--color-text)',
                  borderColor: 'var(--color-brand-border)',
                  fontWeight: 600,
                }}
              >
                LINEAR MONOCHROME
              </span>
              <span style={{ fontSize: '12px', color: 'var(--color-muted)' }}>
                Black & White Precision · Keyboard First
              </span>
            </div>

            <h1 className="text-h1" style={{ color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
              Calculate Your Official Logout Time
            </h1>
            <p className="text-body" style={{ color: 'var(--color-muted)', marginTop: '2px' }}>
              Enter your login time in any format (<code style={{ color: 'var(--color-text)' }}>10 45</code>, <code style={{ color: 'var(--color-text)' }}>10:45</code>, <code style={{ color: 'var(--color-text)' }}>10/45</code>, <code style={{ color: 'var(--color-text)' }}>9;54</code>) and select shift hours.
            </p>
          </div>

          {/* Responsive Grid */}
          <div className="app-grid">
            {/* Left Column: Inputs & Results */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {/* 1. Login Time Input */}
              <LoginTimeInput
                value={loginInput}
                onChange={setLoginInput}
                parsedTime={parseResult.time}
                errorMessage={parseResult.error}
                onSetCurrentTime={handleSetCurrentTime}
                onTogglePeriod={handleTogglePeriod}
              />

              {/* 2. Shift Duration Selector */}
              <WorkHoursSelector
                preset={workPreset}
                onSelectPreset={setWorkPreset}
                customValue={customWorkInput}
                onChangeCustomValue={setCustomWorkInput}
                breakMinutes={breakMinutes}
                onChangeBreakMinutes={setBreakMinutes}
                effectiveWorkMinutes={workHoursResult.totalMinutes}
                effectiveWorkFormatted={workHoursResult.display}
              />

              {/* 3. Primary Output Card */}
              <LogoutResultCard
                calculation={calculation}
                emoji={logoutEmoji}
                onRerollEmoji={handleRerollEmoji}
                onCopyLogoutTime={handleCopyLogoutTime}
                isCopied={isCopied}
              />

              {/* 4. Recent Calculations History */}
              <RecentCalculations
                history={history}
                onSelectHistoryItem={(item) => {
                  setLoginInput(item.loginInput);
                }}
                onClearHistory={() => {
                  setHistory([]);
                  localStorage.removeItem('off_logout_history');
                }}
              />
            </div>

            {/* Right Column: Desk Companion & Live Status */}
            <div className="companion-column">
              {/* Mascot Interactive Box */}
              <MascotDeskCompanion
                character={activeCharacter}
                commentary={mascotCommentary}
                onNextCharacter={handleNextCharacter}
                characterListLength={CHARACTERS.length}
              />

              {/* Linear Tips Card */}
              <div
                className="linear-card"
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  fontSize: '12px',
                  color: 'var(--color-muted)',
                  lineHeight: 1.5,
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    color: 'var(--color-text)',
                    marginBottom: 'var(--space-1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>Keyboard-First Workflow</span>
                  <span className="kbd-badge">?</span>
                </div>
                <p>
                  Press <span className="kbd-badge">N</span> to punch in now, numbers <span className="kbd-badge">1</span>–<span className="kbd-badge">4</span> for shift presets, <span className="kbd-badge">C</span> to copy departure time, and <span className="kbd-badge">D</span> to toggle Dark / Light mode.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Keyboard Shortcuts Dialog */}
        <ShortcutsModal
          isOpen={isShortcutsOpen}
          onClose={() => setIsShortcutsOpen(false)}
        />
      </div>
    </div>
  );
}

export default App;
