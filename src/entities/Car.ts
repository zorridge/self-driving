import { Field } from './Field';
import { Direction, Position, Command } from '../types';

export class Car {
  position: Position;
  direction: Direction;

  constructor(position: Position, direction: Direction) {
    this.position = position;
    this.direction = direction;
  }

  getIntendedPosition(cmd: Command, field: Field): Position {
    if (cmd === Command.Forward) {
      let { x, y } = this.position;
      switch (this.direction) {
        case Direction.N:
          y += 1;
          break;
        case Direction.E:
          x += 1;
          break;
        case Direction.S:
          y -= 1;
          break;
        case Direction.W:
          x -= 1;
          break;
      }
      const nextPos = { x, y };
      return field.isWithinBounds(nextPos) ? nextPos : this.position;
    }

    // For rotation, position doesn't change
    return this.position;
  }

  executeCommand(cmd: Command, field: Field): void {
    if (cmd === Command.Left || cmd === Command.Right) {
      this._rotate(cmd);
    } else if (cmd === Command.Forward) {
      const intended = this.getIntendedPosition(cmd, field);
      this.position = intended;
    }
  }

  private _rotate(cmd: Command) {
    const directions = [Direction.N, Direction.E, Direction.S, Direction.W];
    const idx = directions.indexOf(this.direction);

    let step = 0;
    if (cmd === Command.Left) step = -1;
    else if (cmd === Command.Right) step = 1;

    this.direction =
      directions[(idx + step + directions.length) % directions.length];
  }
}
