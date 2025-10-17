export enum Direction {
  N = 'N',
  E = 'E',
  S = 'S',
  W = 'W',
}

export interface Position {
  x: number;
  y: number;
}

export enum Command {
  Left = 'L',
  Right = 'R',
  Forward = 'F',
}
