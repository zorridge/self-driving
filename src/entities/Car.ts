import { Field } from './Field';
import { Direction, rotateDirection, Position } from '../types';

export class Car {
  position: Position;
  direction: Direction;

  constructor(position: Position, direction: Direction) {
    this.position = position;
    this.direction = direction;
  }

  rotate(turn: 'L' | 'R') {
    this.direction = rotateDirection(this.direction, turn);
  }

  getNextPosition(): Position {
    const { x, y } = this.position;

    switch (this.direction) {
      case Direction.N:
        return { x, y: y + 1 };
      case Direction.E:
        return { x: x + 1, y };
      case Direction.S:
        return { x, y: y - 1 };
      case Direction.W:
        return { x: x - 1, y };
    }
  }

  moveForward(field: Field) {
    const nextPos = this.getNextPosition();
    if (field.isWithinBounds(nextPos)) {
      this.position = nextPos;
    }
    // else, ignore move
  }
}
