export interface Outcome {
  id: string;
  chance: number;
  multiplier: number;
}

export const outcomes: Outcome[] = [
  { id: 'Double the money', chance: 0.33, multiplier: 2 },
  { id: 'Lose everything', chance: 0.33, multiplier: 0 },
  { id: 'Nothing happens', chance: 0.34, multiplier: 1 },
];

export function spinWheel(): Outcome {
  const spinResult = Math.random();

  let outcomeIndex = 0;
  let current = outcomes[0].chance;
  while (current <= 1 || outcomeIndex < outcomes.length) {
    if (spinResult <= current) {
      return outcomes[outcomeIndex];
    }

    outcomeIndex += 1;
    current += outcomes[outcomeIndex].chance;
  }

  return outcomes[outcomeIndex];
}
