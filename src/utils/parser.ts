import { Field } from '../entities/Field';
import { Car } from '../entities/Car';
import { Command, Direction, Position } from '../types';

export interface CarInput {
  id: string;
  car: Car;
  commands: Command[];
}

export function parseSingleCarInput(input: string): {
  field: Field;
  car: CarInput;
} {
  const lines = input.trim().split('\n');
  if (lines.length < 3) {
    throw new Error(
      'Input must have at least 3 lines: field size, car position/direction, commands.',
    );
  }

  const field = _parseField(lines[0]);
  const { position, direction } = _parseCarPosition(lines[1], field);
  const commands = _parseCommands(lines[2]);
  return {
    field,
    car: {
      id: '0',
      car: new Car(position, direction),
      commands,
    },
  };
}

export function parseMultiCarInput(input: string): {
  field: Field;
  cars: CarInput[];
} {
  const lines = input.trim().split('\n');
  if (lines.length < 4) {
    throw new Error(
      'Input must have at least 4 lines for multi-car simulation.',
    );
  }
  const field = _parseField(lines[0]);
  const cars: CarInput[] = [];

  let i = 1;
  while (i < lines.length) {
    const id = lines[i].trim();
    if (!id) throw new Error('Car ID cannot be empty.');
    if (i + 2 >= lines.length) throw new Error('Incomplete car definition.');

    const { position, direction } = _parseCarPosition(lines[i + 1], field);
    const commands = _parseCommands(lines[i + 2]);
    cars.push({
      id,
      car: new Car(position, direction),
      commands,
    });

    i += 3;
  }

  // Check for duplicate IDs
  const ids = cars.map((c) => c.id);
  if (new Set(ids).size !== ids.length) {
    throw new Error('Duplicate car IDs are not allowed.');
  }

  // Check for initial position collision
  const positions = cars.map((c) => `${c.car.position.x},${c.car.position.y}`);
  if (new Set(positions).size !== positions.length) {
    throw new Error('Two cars cannot start at the same position.');
  }

  return {
    field,
    cars,
  };
}

function _parseField(line: string): Field {
  const [widthStr, heightStr] = line.split(' ');
  const width = Number(widthStr);
  const height = Number(heightStr);

  if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
    throw new Error(
      'Invalid field size. Width and height must be positive integers.',
    );
  }

  return new Field(width, height);
}

function _parseCarPosition(
  line: string,
  field: Field,
): { position: Position; direction: Direction } {
  const [xStr, yStr, dirStr] = line.split(' ');
  const x = Number(xStr);
  const y = Number(yStr);

  if (
    isNaN(x) ||
    isNaN(y) ||
    x < 0 ||
    y < 0 ||
    x >= field.width ||
    y >= field.height
  ) {
    throw new Error(
      'Invalid car position. Position must be within field bounds.',
    );
  }

  if (!Object.values(Direction).includes(dirStr as Direction)) {
    throw new Error('Invalid car direction. Must be N, E, S, or W.');
  }

  return { position: { x, y }, direction: dirStr as Direction };
}

function _parseCommands(cmdStr: string): Command[] {
  return cmdStr.split('').map((char) => {
    switch (char) {
      case 'L':
        return Command.Left;
      case 'R':
        return Command.Right;
      case 'F':
        return Command.Forward;
      default:
        throw new Error(`Invalid command character: ${char}`);
    }
  });
}
