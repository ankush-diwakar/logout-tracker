export interface LogoutEmoji {
  emoji: string;
  name: string;
  mood: string;
  punchline: string;
}

export const LOGOUT_EMOJIS: LogoutEmoji[] = [
  { emoji: '🚀', name: 'Rocket Launch', mood: 'Escape velocity', punchline: 'Blasting off from the desk into freedom!' },
  { emoji: '🏃‍♂️', name: 'Desk Runner', mood: 'Sprint', punchline: 'No walking allowed after punch-out time.' },
  { emoji: '🎉', name: 'Party Popper', mood: 'Celebration', punchline: 'Another day conquered in the books!' },
  { emoji: '🏖️', name: 'Beach Breeze', mood: 'Vacation mode', punchline: 'Mentally on a tropical hammock right now.' },
  { emoji: '🛋️', name: 'Couch Potato', mood: 'Max relaxation', punchline: 'Reserved spot on the couch is calling.' },
  { emoji: '🍕', name: 'Pizza Time', mood: 'Feast mode', punchline: 'Calories don’t count after logging out.' },
  { emoji: '☕', name: 'Last Sip', mood: 'Unwind', punchline: 'Switching from emergency coffee to peaceful tea.' },
  { emoji: '🍺', name: 'Cold Pint', mood: 'Cheers', punchline: 'Time to clink glasses with the evening.' },
  { emoji: '🎮', name: 'Gamer Zone', mood: 'Play', punchline: 'Closing IDE, launching game library.' },
  { emoji: '🥳', name: 'Party Face', mood: 'Jubilant', punchline: 'Shift complete! Do a little desk dance.' },
  { emoji: '🎯', name: 'Bullseye', mood: 'Target Hit', punchline: 'Hours clocked with razor-sharp precision.' },
  { emoji: '🕺', name: 'Disco King', mood: 'Groovy', punchline: 'Sliding right out the door in style.' },
  { emoji: '🌮', name: 'Taco Fiesta', mood: 'Craving satisfied', punchline: 'Off-time reward: warm tacos await.' },
  { emoji: '🍹', name: 'Sunset Spritz', mood: 'Chilled', punchline: 'Golden hour drinks on standby.' },
  { emoji: '✨', name: 'Sparkles', mood: 'Flawless', punchline: 'Clean exit with zero pending PRs.' },
  { emoji: '🕶️', name: 'Cool Shades', mood: 'Boss', punchline: 'Walking away in slow motion.' },
  { emoji: '⚡', name: 'Lightning Flash', mood: 'High power', punchline: 'Clocked out with supernatural speed.' },
  { emoji: '💃', name: 'Freedom Dance', mood: 'Joy', punchline: 'Logging off like nobody’s watching.' },
  { emoji: '🍿', name: 'Binge Watcher', mood: 'Cozy', punchline: 'Queue up the shows, work is officially done.' },
  { emoji: '🎧', name: 'Beat Drop', mood: 'Vibing', punchline: 'Switching meeting audio to favorite tunes.' },
  { emoji: '🌅', name: 'Golden Hour', mood: 'Serene', punchline: 'Catching the sunset before darkness falls.' },
  { emoji: '🏝️', name: 'Desert Island', mood: 'Offline', punchline: 'Do Not Disturb status: permanently active.' },
  { emoji: '🚲', name: 'Bike Cruise', mood: 'Outdoors', punchline: 'Pedaling into the cool evening breeze.' },
  { emoji: '🧘', name: 'Zen Master', mood: 'Peace', punchline: 'Breathing out work tension, breathing in calm.' },
  { emoji: '🛌', name: 'Nap Specialist', mood: 'Recharge', punchline: 'Gravity is pulling straight toward the bed.' }
];

export function getRandomLogoutEmoji(exclude?: string): LogoutEmoji {
  const pool = exclude ? LOGOUT_EMOJIS.filter(e => e.emoji !== exclude) : LOGOUT_EMOJIS;
  const index = Math.floor(Math.random() * pool.length);
  return pool[index] || LOGOUT_EMOJIS[0];
}

export function getMascotCommentary(
  percent: number,
  remainingFormatted: string,
  logoutTime12: string,
  isCompleted: boolean,
  isUpcoming: boolean
): string {
  if (isCompleted) {
    return `Logout time (${logoutTime12}) has arrived! Pack your bags and scram! 🏃💨`;
  }
  if (isUpcoming) {
    return `Shift hasn't started yet. Grab a tea and get ready for a great day! ✨`;
  }
  if (percent >= 90) {
    return `Final stretch! Only ${remainingFormatted} left until ${logoutTime12}! 🚀`;
  }
  if (percent >= 75) {
    return `75% done! Home is in sight — ${remainingFormatted} to go! 🎯`;
  }
  if (percent >= 50) {
    return `Halfway through! Powering through the afternoon until ${logoutTime12}. ☕`;
  }
  if (percent >= 25) {
    return `Quarter mark passed! Settling into the groove until ${logoutTime12}. ⚡`;
  }
  return `Clocked in! Off time locked at ${logoutTime12} (${remainingFormatted} remaining). Poke me anytime! 👀`;
}
