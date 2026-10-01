import { describe, expect, test } from 'bun:test';
import { formatDayPhrase, formatShortDay, MS_DAY } from './taskUtils';

const today = new Date(2026, 9, 1).getTime();

describe('formatShortDay', () => {
  test('formats weekday, month and day', () => {
    expect(formatShortDay(today)).toBe('Thu, Oct 1');
  });
});

describe('formatDayPhrase', () => {
  test('uses relative words for the last week', () => {
    expect(formatDayPhrase(today, today)).toBe('today');
    expect(formatDayPhrase(today - MS_DAY, today)).toBe('yesterday');
    expect(formatDayPhrase(today - 2 * MS_DAY, today)).toBe('2 days ago');
    expect(formatDayPhrase(today - 6 * MS_DAY, today)).toBe('6 days ago');
  });

  test('falls back to the short date with an optional prefix', () => {
    expect(formatDayPhrase(today - 10 * MS_DAY, today)).toBe('Mon, Sep 21');
    expect(formatDayPhrase(today - 10 * MS_DAY, today, 'on ')).toBe(
      'on Mon, Sep 21'
    );
  });

  test('ignores the time of day', () => {
    expect(formatDayPhrase(today - MS_DAY + 15 * 3600000, today)).toBe(
      'yesterday'
    );
  });
});
