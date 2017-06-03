import { prettyDuration } from '../utils';

describe('prettyDuration', () => {
  it('should pretty print a duration', () => {
    const result = prettyDuration(1000 * 60 * 60 * 1); // ms

    expect(result).toBe('1 hour');
  });

  it('should pretty print minutes', () => {
    const result = prettyDuration(1000 * 60 * 60 * 0.5); // ms

    expect(result).toBe('30 min');
  });

  it('should pretty print hours', () => {
    const result = prettyDuration(1000 * 60 * 60 * 2); // ms

    expect(result).toBe('2 hours');
  });

  it('should pretty print hours and minutes', () => {
    const result = prettyDuration(1000 * 60 * 60 * 2.5); // ms

    expect(result).toBe('2 hours 30 min');
  });
});
