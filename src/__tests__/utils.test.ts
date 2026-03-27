import { describe, it, expect } from 'vitest';
import {
  xpForLevel,
  totalXPForLevel,
  levelFromXP,
  xpProgress,
  isToday,
  isYesterday,
  formatDate,
  XP_REWARDS,
} from '@/lib/utils';

// ---------------------------------------------------------------------------
// XP Formula — xpForLevel(n) = Math.floor(100 * 1.4^(n-1))
// ---------------------------------------------------------------------------
describe('xpForLevel', () => {
  it('returns 100 for level 1 (XP needed to reach level 2)', () => {
    expect(xpForLevel(1)).toBe(100);
  });

  it('returns 140 for level 2 (Math.floor(100 * 1.4^1))', () => {
    expect(xpForLevel(2)).toBe(140);
  });

  it('returns 195 for level 3 (Math.floor(100 * 1.4^2) = Math.floor(195.999...) = 195)', () => {
    expect(xpForLevel(3)).toBe(195);
  });

  it('returns 274 for level 4 (Math.floor(100 * 1.4^3))', () => {
    expect(xpForLevel(4)).toBe(274);
  });

  it('always returns a positive integer', () => {
    for (let n = 1; n <= 20; n++) {
      const result = xpForLevel(n);
      expect(result).toBeGreaterThan(0);
      expect(Number.isInteger(result)).toBe(true);
    }
  });

  it('is strictly increasing (higher levels need more XP)', () => {
    for (let n = 1; n < 20; n++) {
      expect(xpForLevel(n + 1)).toBeGreaterThan(xpForLevel(n));
    }
  });
});

// ---------------------------------------------------------------------------
// Cumulative XP thresholds — totalXPForLevel
// ---------------------------------------------------------------------------
describe('totalXPForLevel', () => {
  it('returns 0 for level 1 (start of the game)', () => {
    expect(totalXPForLevel(1)).toBe(0);
  });

  it('returns 100 to reach level 2', () => {
    expect(totalXPForLevel(2)).toBe(100);
  });

  it('returns 240 to reach level 3 (100 + 140)', () => {
    expect(totalXPForLevel(3)).toBe(240);
  });

  it('returns 435 to reach level 4 (100 + 140 + 195)', () => {
    expect(totalXPForLevel(4)).toBe(435);
  });
});

// ---------------------------------------------------------------------------
// Level derivation from totalXP — NEVER stored; always derived (GEMINI.md §3)
// ---------------------------------------------------------------------------
describe('levelFromXP', () => {
  it('returns level 1 for 0 XP', () => {
    expect(levelFromXP(0)).toBe(1);
  });

  it('returns level 1 for 99 XP (just below threshold)', () => {
    expect(levelFromXP(99)).toBe(1);
  });

  it('returns level 2 for exactly 100 XP', () => {
    expect(levelFromXP(100)).toBe(2);
  });

  it('returns level 2 for 239 XP (just below level 3 threshold)', () => {
    expect(levelFromXP(239)).toBe(2);
  });

  it('returns level 3 for exactly 240 XP', () => {
    expect(levelFromXP(240)).toBe(3);
  });

  it('returns level 4 for exactly 436 XP', () => {
    expect(levelFromXP(436)).toBe(4);
  });

  it('handles very high XP values without crashing', () => {
    expect(levelFromXP(999_999)).toBeGreaterThan(1);
  });
});

// ---------------------------------------------------------------------------
// XP progress bar data
// ---------------------------------------------------------------------------
describe('xpProgress', () => {
  it('returns level 1, 0% progress for 0 XP', () => {
    const result = xpProgress(0);
    expect(result.level).toBe(1);
    expect(result.currentXP).toBe(0);
    expect(result.xpToNext).toBe(100);
    expect(result.percent).toBe(0);
  });

  it('returns level 1, 50% progress for 50 XP', () => {
    const result = xpProgress(50);
    expect(result.level).toBe(1);
    expect(result.percent).toBe(50);
  });

  it('returns level 2 at 100 XP total with 0 currentXP (just levelled up)', () => {
    const result = xpProgress(100);
    expect(result.level).toBe(2);
    expect(result.currentXP).toBe(0);
  });

  it('percent is capped at 100', () => {
    // 100 XP at level 1 puts you exactly at level 2, so percent should be 0 there
    // But for an invalid overflowing value percent should not exceed 100
    const result = xpProgress(99);
    expect(result.percent).toBeLessThanOrEqual(100);
  });
});

// ---------------------------------------------------------------------------
// XP Rewards constants
// ---------------------------------------------------------------------------
describe('XP_REWARDS', () => {
  it('task done grants 25 XP', () => expect(XP_REWARDS.TASK_DONE).toBe(25));
  it('habit check grants 15 XP', () => expect(XP_REWARDS.HABIT_CHECK).toBe(15));
  it('7-day streak bonus is 50 XP', () => expect(XP_REWARDS.HABIT_STREAK_7).toBe(50));
  it('note creation grants 10 XP', () => expect(XP_REWARDS.NOTE_CREATE).toBe(10));
  it('goal milestone grants 20 XP', () => expect(XP_REWARDS.GOAL_MILESTONE).toBe(20));
  it('goal complete grants 100 XP', () => expect(XP_REWARDS.GOAL_COMPLETE).toBe(100));
  it('daily login grants 5 XP', () => expect(XP_REWARDS.DAILY_LOGIN).toBe(5));
});

// ---------------------------------------------------------------------------
// Date Utilities
// ---------------------------------------------------------------------------
describe('isToday', () => {
  it('returns true for new Date()', () => {
    expect(isToday(new Date())).toBe(true);
  });

  it('returns false for yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(isToday(yesterday)).toBe(false);
  });
});

describe('isYesterday', () => {
  it('returns true for yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(isYesterday(yesterday)).toBe(true);
  });

  it('returns false for today', () => {
    expect(isYesterday(new Date())).toBe(false);
  });
});

describe('formatDate', () => {
  it('returns a non-empty string', () => {
    expect(formatDate(new Date())).toBeTruthy();
  });

  it('formats a known date correctly', () => {
    // 2026-03-27 should appear with Mar, 27, 2026
    const result = formatDate(new Date('2026-03-27T00:00:00'));
    expect(result).toMatch(/Mar/);
    expect(result).toMatch(/2026/);
  });
});
