import { formatTime, formatBytes } from './utils';

it('should format the seconds to a valid time string', () => {
  expect(formatTime(1)).toBe('1 s');
  expect(formatTime(1107)).toBe('18 mins');
  expect(formatTime(4800)).toBe('1.3 h');
});

it('should format the bytes input to a correct memory unit', () => {
  expect(formatBytes(1456)).toBe(1.42);
  expect(formatBytes(10456)).toBe(10.21);
  expect(formatBytes(-2424)).toBe(0);
  expect(formatBytes(NaN)).toBe(0);
})
