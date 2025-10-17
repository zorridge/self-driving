export enum Direction {
  N = 'N',
  E = 'E',
  S = 'S',
  W = 'W',
}

const directionOrder = [Direction.N, Direction.E, Direction.S, Direction.W];

export function rotateDirection(
  current: Direction,
  turn: 'L' | 'R',
): Direction {
  let idx = directionOrder.indexOf(current);

  if (turn === 'L') idx = (idx + 3) % 4; // left (counterclockwise)
  else idx = (idx + 1) % 4; // right (clockwise)
  return directionOrder[idx];
}

export interface Position {
  x: number;
  y: number;
}
