const DEFAULT_MIN_DELAY = 1000; // 1 second
const DEFAULT_MAX_DELAY = 10000; // 10 seconds
const DEFAULT_FACTOR = 2;

export function calculateBackoff(
  attempt: number,
  options: {
    minDelay?: number;
    maxDelay?: number;
    factor?: number;
  } = {}
): number {
  const {
    minDelay = DEFAULT_MIN_DELAY,
    maxDelay = DEFAULT_MAX_DELAY,
    factor = DEFAULT_FACTOR
  } = options;

  const delay = minDelay * Math.pow(factor, attempt);
  return Math.min(delay, maxDelay);
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));