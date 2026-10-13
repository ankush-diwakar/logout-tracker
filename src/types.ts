export type ThemeMode = 'dark' | 'light';

export interface MascotCharacter {
  id: string;
  name: string;
  tagline: string;
  directions: string;
  reactions: string;
}

export interface CalculationHistoryItem {
  id: string;
  loginInput: string;
  workHoursInput: string;
  loginTime12: string;
  logoutTime12: string;
  emoji: string;
  timestamp: number;
}
