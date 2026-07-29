import { describe, expect, it } from 'vitest';
import { formatTimestampToDate } from '@/services/formatTimestampToDate';

describe('formatTimestampToDate', () => {
  it('formats local midnight timestamp as dd.mm.yyyy', () => {
    const timestamp = new Date(2026, 6, 29).getTime();
    expect(formatTimestampToDate(timestamp)).toBe('29.07.2026');
  });

  it('pads single-digit day and month', () => {
    const timestamp = new Date(2026, 0, 5).getTime();
    expect(formatTimestampToDate(timestamp)).toBe('05.01.2026');
  });
});
