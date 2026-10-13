export interface LogoutCalculation {
  loginTime12: string;
  loginTime24: string;
  loginTotalMinutes: number;

  workMinutes: number;
  workHoursFormatted: string;

  breakMinutes: number;

  logoutHours: number;
  logoutMinutes: number;
  logoutTime12: string;
  logoutTime24: string;
  isNextDay: boolean;

  // Live status comparison
  isCompleted: boolean;
  isUpcoming: boolean;
  isInProgress: boolean;
  progressPercent: number;
  remainingMinutes: number;
  remainingFormatted: string;
  elapsedMinutes: number;
  elapsedFormatted: string;
}

export function calculateLogoutTime(
  loginHours: number,
  loginMinutes: number,
  workMinutes: number,
  breakMinutes: number = 0,
  referenceDate: Date = new Date()
): LogoutCalculation {
  const loginTotalMinutes = loginHours * 60 + loginMinutes;
  const totalShiftDuration = workMinutes + breakMinutes;
  const rawLogoutMinutes = loginTotalMinutes + totalShiftDuration;

  const isNextDay = rawLogoutMinutes >= 24 * 60;
  const normalizedLogoutMinutes = rawLogoutMinutes % (24 * 60);

  const logoutHours = Math.floor(normalizedLogoutMinutes / 60);
  const logoutMins = normalizedLogoutMinutes % 60;

  const logoutPeriod = logoutHours >= 12 ? 'PM' : 'AM';
  const displayLogoutHours12 = logoutHours % 12 === 0 ? 12 : logoutHours % 12;
  const logoutTime12 = `${displayLogoutHours12}:${logoutMins.toString().padStart(2, '0')} ${logoutPeriod}`;
  const logoutTime24 = `${logoutHours.toString().padStart(2, '0')}:${logoutMins.toString().padStart(2, '0')}`;

  const loginPeriod = loginHours >= 12 ? 'PM' : 'AM';
  const displayLoginHours12 = loginHours % 12 === 0 ? 12 : loginHours % 12;
  const loginTime12 = `${displayLoginHours12}:${loginMinutes.toString().padStart(2, '0')} ${loginPeriod}`;
  const loginTime24 = `${loginHours.toString().padStart(2, '0')}:${loginMinutes.toString().padStart(2, '0')}`;

  // Work hours formatted
  const wh = Math.floor(workMinutes / 60);
  const wm = workMinutes % 60;
  const workHoursFormatted = wm > 0 ? `${wh}h ${wm}m` : `${wh}h`;

  // Live state calculations based on current time
  const currentTotalMinutes = referenceDate.getHours() * 60 + referenceDate.getMinutes();

  let elapsedMinutes: number;
  let remainingMinutes: number;
  let isCompleted = false;
  let isUpcoming = false;
  let isInProgress = false;
  let progressPercent: number;

  if (isNextDay) {
    // If shift spans midnight
    if (currentTotalMinutes < loginTotalMinutes && currentTotalMinutes > normalizedLogoutMinutes) {
      isUpcoming = true;
      elapsedMinutes = 0;
      remainingMinutes = totalShiftDuration;
      progressPercent = 0;
    } else {
      let currentShiftPosition: number;
      if (currentTotalMinutes >= loginTotalMinutes) {
        currentShiftPosition = currentTotalMinutes - loginTotalMinutes;
      } else {
        currentShiftPosition = (24 * 60 - loginTotalMinutes) + currentTotalMinutes;
      }

      if (currentShiftPosition >= totalShiftDuration) {
        isCompleted = true;
        elapsedMinutes = totalShiftDuration;
        remainingMinutes = 0;
        progressPercent = 100;
      } else {
        isInProgress = true;
        elapsedMinutes = currentShiftPosition;
        remainingMinutes = totalShiftDuration - currentShiftPosition;
        progressPercent = Math.min(100, Math.max(0, Math.round((elapsedMinutes / totalShiftDuration) * 100)));
      }
    }
  } else {
    // Standard same-day shift
    if (currentTotalMinutes < loginTotalMinutes) {
      isUpcoming = true;
      elapsedMinutes = 0;
      remainingMinutes = totalShiftDuration;
      progressPercent = 0;
    } else if (currentTotalMinutes >= rawLogoutMinutes) {
      isCompleted = true;
      elapsedMinutes = totalShiftDuration;
      remainingMinutes = 0;
      progressPercent = 100;
    } else {
      isInProgress = true;
      elapsedMinutes = currentTotalMinutes - loginTotalMinutes;
      remainingMinutes = rawLogoutMinutes - currentTotalMinutes;
      progressPercent = Math.min(100, Math.max(0, Math.round((elapsedMinutes / totalShiftDuration) * 100)));
    }
  }

  const formatMinSec = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) {
      return m > 0 ? `${h}h ${m}m` : `${h}h`;
    }
    return `${m}m`;
  };

  const remainingFormatted = isCompleted ? 'Shift completed' : formatMinSec(remainingMinutes);
  const elapsedFormatted = formatMinSec(elapsedMinutes);

  return {
    loginTime12,
    loginTime24,
    loginTotalMinutes,
    workMinutes,
    workHoursFormatted,
    breakMinutes,
    logoutHours,
    logoutMinutes: logoutMins,
    logoutTime12,
    logoutTime24,
    isNextDay,
    isCompleted,
    isUpcoming,
    isInProgress,
    progressPercent,
    remainingMinutes,
    remainingFormatted,
    elapsedMinutes,
    elapsedFormatted,
  };
}
