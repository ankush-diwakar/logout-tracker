/**
 * Robust flexible time parser for Off-Logout.
 * Supports any user combination such as:
 * - "10 45", "10:45", "10/45", "9;54", "09 54", "9.54", "9-54", "9,54"
 * - Compact digits: "954" -> 9:54, "1045" -> 10:45, "0954" -> 09:54, "830" -> 08:30
 * - Single hour: "9" -> 09:00, "10" -> 10:00
 * - AM / PM variations: "10 45 am", "9:54pm", "1 30 pm", "14:20"
 */

export interface ParsedTime {
  hours: number;       // 0-23
  minutes: number;     // 0-59
  raw: string;
  formatted12: string; // e.g. "10:45 AM"
  formatted24: string; // e.g. "10:45"
  period: 'AM' | 'PM';
}

export interface ParseResult {
  success: boolean;
  time?: ParsedTime;
  error?: string;
}

export function parseFlexibleTime(input: string, preferPeriod?: 'AM' | 'PM'): ParseResult {
  if (!input || !input.trim()) {
    return { success: false, error: 'Please enter a login time' };
  }

  const raw = input.trim();
  let cleaned = raw.toLowerCase();

  // Detect AM / PM if present
  let detectedPeriod: 'AM' | 'PM' | null = null;
  if (cleaned.includes('am') || cleaned.includes('a.m.')) {
    detectedPeriod = 'AM';
    cleaned = cleaned.replace(/a\.?m\.?/g, '').trim();
  } else if (cleaned.includes('pm') || cleaned.includes('p.m.')) {
    detectedPeriod = 'PM';
    cleaned = cleaned.replace(/p\.?m\.?/g, '').trim();
  }

  let hours = -1;
  let minutes = 0;

  // Replace common delimiters (:, /, ;, -, ., ,, space) with a single space
  const normalizedSeparators = cleaned.replace(/[:/;.,\-\s]+/g, ' ').trim();

  if (normalizedSeparators.includes(' ')) {
    const parts = normalizedSeparators.split(' ');
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);

    if (!isNaN(h) && !isNaN(m)) {
      hours = h;
      minutes = m;
    }
  } else if (/^\d{3,4}$/.test(normalizedSeparators)) {
    // 3 or 4 digits compact string: 954 -> 9:54, 1045 -> 10:45
    if (normalizedSeparators.length === 3) {
      hours = parseInt(normalizedSeparators.substring(0, 1), 10);
      minutes = parseInt(normalizedSeparators.substring(1), 10);
    } else {
      hours = parseInt(normalizedSeparators.substring(0, 2), 10);
      minutes = parseInt(normalizedSeparators.substring(2), 10);
    }
  } else if (/^\d{1,2}$/.test(normalizedSeparators)) {
    // Single or double digit hour, e.g. "9" or "10"
    hours = parseInt(normalizedSeparators, 10);
    minutes = 0;
  } else {
    return {
      success: false,
      error: `Could not understand "${input}". Try e.g. 10 45, 10:45, 9;54, or 10/45.`,
    };
  }

  if (hours < 0 || minutes < 0 || minutes > 59) {
    return {
      success: false,
      error: `Invalid time "${input}". Minutes must be between 0 and 59.`,
    };
  }

  // Adjust for AM / PM or 24h logic
  if (detectedPeriod) {
    if (hours === 12) {
      hours = detectedPeriod === 'AM' ? 0 : 12;
    } else if (detectedPeriod === 'PM' && hours < 12) {
      hours += 12;
    } else if (detectedPeriod === 'AM' && hours >= 12 && hours < 24) {
      hours -= 12;
    }
  } else if (preferPeriod) {
    if (hours < 12) {
      if (preferPeriod === 'PM' && hours !== 0) {
        hours += 12;
      }
    }
  } else {
    // Default smart shift context:
    // If hour is 1..6 (e.g. 1:30 or 2:00), in office work it's usually afternoon 1:30 PM (13:30) or if 7..11 it's AM (7:00 AM - 11:59 AM)
    // If hour is 12, it's 12:00 PM (noon).
    // If hour is 13..23, it's already 24-hour time.
    if (hours >= 1 && hours <= 6) {
      // Typically afternoon if not specified, but let's keep 24-hr as is if hours > 12
      // Let's check: 1 to 6 without AM/PM is usually 1 PM - 6 PM for late starts or 1:00 PM
      // However, if someone typed 9 or 10, it's 9 AM / 10 AM.
      // We will default 1-6 to PM (13-18), 7-11 to AM (7-11), 12 to 12 PM.
      hours += 12;
    }
  }

  if (hours < 0 || hours > 23) {
    return {
      success: false,
      error: `Invalid hour in "${input}". Must be between 0 and 23 (or 1-12 with AM/PM).`,
    };
  }

  const period: 'AM' | 'PM' = hours >= 12 ? 'PM' : 'AM';
  const displayHours12 = hours % 12 === 0 ? 12 : hours % 12;
  const formatted12 = `${displayHours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  const formatted24 = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  return {
    success: true,
    time: {
      hours,
      minutes,
      raw,
      formatted12,
      formatted24,
      period,
    },
  };
}

/**
 * Flexible working hours parser.
 * Supports:
 * - "8.5", "4.5", "8", "9"
 * - "8:30", "4:30", "8 30", "8h 30m", "8h30m", "8h", "30m"
 */
export function parseWorkingHours(input: string | number): {
  totalMinutes: number;
  decimalHours: number;
  display: string;
  isValid: boolean;
} {
  if (typeof input === 'number') {
    const totalMinutes = Math.round(input * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return {
      totalMinutes,
      decimalHours: input,
      display: m > 0 ? `${h}h ${m}m` : `${h}h`,
      isValid: input > 0,
    };
  }

  const str = input.trim().toLowerCase();
  if (!str) {
    return { totalMinutes: 0, decimalHours: 0, display: '0h', isValid: false };
  }

  // Check pattern "8h 30m" or "8h30" or "8h"
  const hMatch = str.match(/(\d+(?:\.\d+)?)\s*h(?:ours?)?/);
  const mMatch = str.match(/(\d+)\s*m(?:in(?:utes?)?)?/);

  if (hMatch || mMatch) {
    const hours = hMatch ? parseFloat(hMatch[1]) : 0;
    const mins = mMatch ? parseInt(mMatch[1], 10) : 0;
    const totalMinutes = Math.round(hours * 60) + mins;
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return {
      totalMinutes,
      decimalHours: Number((totalMinutes / 60).toFixed(2)),
      display: m > 0 ? `${h}h ${m}m` : `${h}h`,
      isValid: totalMinutes > 0,
    };
  }

  // Check pattern "8:30" or "8 30"
  if (/^\d{1,2}[:\s]\d{1,2}$/.test(str)) {
    const parts = str.split(/[:\s]/);
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const totalMinutes = h * 60 + m;
    return {
      totalMinutes,
      decimalHours: Number((totalMinutes / 60).toFixed(2)),
      display: m > 0 ? `${h}h ${m}m` : `${h}h`,
      isValid: totalMinutes > 0,
    };
  }

  // Pure decimal e.g. "8.5" or "4.5" or "8"
  const val = parseFloat(str);
  if (!isNaN(val) && val > 0) {
    const totalMinutes = Math.round(val * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return {
      totalMinutes,
      decimalHours: val,
      display: m > 0 ? `${h}h ${m}m` : `${h}h`,
      isValid: true,
    };
  }

  return { totalMinutes: 0, decimalHours: 0, display: str, isValid: false };
}
