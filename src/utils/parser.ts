import { Field } from '../entities/Field';
import { Car } from '../entities/Car';
import { Direction } from '../types';

export interface CarInput {
  id: string;
  car: Car;
  commands: string[];
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

  // Validate field size
  const [widthStr, heightStr] = lines[0].split(' ');
  const width = Number(widthStr);
  const height = Number(heightStr);
  if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
    throw new Error(
      'Invalid field size. Width and height must be positive integers.',
    );
  }

  // Validate car position and direction
  const [xStr, yStr, dirStr] = lines[1].split(' ');
  const x = Number(xStr);
  const y = Number(yStr);
  if (isNaN(x) || isNaN(y) || x < 0 || y < 0 || x >= width || y >= height) {
    throw new Error(
      'Invalid car position. Position must be within field bounds.',
    );
  }
  if (!['N', 'E', 'S', 'W'].includes(dirStr)) {
    throw new Error('Invalid car direction. Must be N, E, S, or W.');
  }

  // Validate commands
  const commands = lines[2].split('');
  if (!commands.every((cmd) => ['L', 'R', 'F'].includes(cmd))) {
    throw new Error('Commands must only contain L, R, or F.');
  }

  return {
    field: new Field(width, height),
    car: {
      id: '0',
      car: new Car({ x, y }, dirStr as Direction),
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

  // Validate field size
  const [widthStr, heightStr] = lines[0].split(' ');
  const width = Number(widthStr);
  const height = Number(heightStr);
  if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
    throw new Error(
      'Invalid field size. Width and height must be positive integers.',
    );
  }

  // Parse cars
  const cars: CarInput[] = [];
  let i = 1;
  while (i < lines.length) {
    const id = lines[i].trim();
    if (!id) throw new Error('Car ID cannot be empty.');

    if (i + 2 >= lines.length) throw new Error('Incomplete car definition.');

    // Validate car position and direction
    const [xStr, yStr, dirStr] = lines[i + 1].split(' ');
    const x = Number(xStr);
    const y = Number(yStr);
    if (isNaN(x) || isNaN(y) || x < 0 || y < 0 || x >= width || y >= height) {
      throw new Error(`Invalid car position for car ${id}.`);
    }
    if (!['N', 'E', 'S', 'W'].includes(dirStr)) {
      throw new Error(`Invalid direction for car ${id}.`);
    }

    // Validate commands
    const commands = lines[i + 2].split('');
    if (!commands.every((cmd) => ['L', 'R', 'F'].includes(cmd))) {
      throw new Error(`Invalid commands for car ${id}.`);
    }

    cars.push({
      id,
      car: new Car({ x, y }, dirStr as Direction),
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
    field: new Field(width, height),
    cars,
  };
}
