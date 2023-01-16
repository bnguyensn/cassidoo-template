/**
 * Return a random integer between a start integer and an end integer.
 */
export function getRandomIntBetween(start: number, end: number): number {
  return Math.round(start + Math.random() * (end - start));
}
