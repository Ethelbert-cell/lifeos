import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ---------------------------------------------------------------------------
// Tailwind className helper
// ---------------------------------------------------------------------------
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ---------------------------------------------------------------------------
// XP Reward Constants (GEMINI.md §3)
// ---------------------------------------------------------------------------
export const XP_REWARDS = {
  TASK_DONE: 25,
  HABIT_CHECK: 15,
  HABIT_STREAK_7: 50,
  NOTE_CREATE: 10,
  GOAL_MILESTONE: 20,
  GOAL_COMPLETE: 100,
  DAILY_LOGIN: 5,
} as const;

// ---------------------------------------------------------------------------
// Gamification Engine — XP / Level Math (GEMINI.md §3)
// Formula: xpForLevel(n) = Math.floor(100 * 1.4^(n-1))
//   Level 1 → needs  100 XP to reach Level 2
//   Level 2 → needs  140 XP to reach Level 3
//   Level 3 → needs  196 XP to reach Level 4
// ---------------------------------------------------------------------------

/**
 * Returns the XP required to advance FROM level `n` to level `n+1`.
 * e.g. xpForLevel(1) = 100, xpForLevel(2) = 140
 */
export function xpForLevel(n: number): number {
  return Math.floor(100 * Math.pow(1.4, n - 1));
}

/**
 * Returns the total cumulative XP needed to REACH level `n`.
 * e.g. totalXPForLevel(1) = 0, totalXPForLevel(2) = 100, totalXPForLevel(3) = 240
 */
export function totalXPForLevel(n: number): number {
  if (n <= 1) return 0;
  let total = 0;
  for (let i = 1; i < n; i++) {
    total += xpForLevel(i);
  }
  return total;
}

/**
 * Derives the current level from accumulated totalXP.
 * Level is NEVER stored statically — always computed from XP (GEMINI.md §3).
 */
export function levelFromXP(totalXP: number): number {
  let level = 1;
  let accumulated = 0;
  while (accumulated + xpForLevel(level) <= totalXP) {
    accumulated += xpForLevel(level);
    level++;
  }
  return level;
}

/**
 * Returns detailed XP progress data for the UI XP bar.
 */
export function xpProgress(totalXP: number): {
  level: number;
  currentXP: number;
  xpToNext: number;
  percent: number;
} {
  const level = levelFromXP(totalXP);
  const xpAtCurrentLevel = totalXPForLevel(level);
  const xpNeededForNext = xpForLevel(level);
  const currentXP = totalXP - xpAtCurrentLevel;
  const percent = Math.min(100, Math.floor((currentXP / xpNeededForNext) * 100));

  return { level, currentXP, xpToNext: xpNeededForNext, percent };
}

// ---------------------------------------------------------------------------
// Date Utilities
// ---------------------------------------------------------------------------

/** Returns true if the given date is today (local time). */
export function isToday(date: Date | string): boolean {
  const d = new Date(date);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

/** Returns true if the given date was yesterday (local time). */
export function isYesterday(date: Date | string): boolean {
  const d = new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate()
  );
}

/** Formats a date as "Mar 27, 2026". */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
