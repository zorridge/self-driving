import { Field } from '../entities/Field';
import { Car } from '../entities/Car';
import { Direction } from '../types';

export function parseInput(input: string) {
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
    car: new Car({ x, y }, dirStr as Direction),
    commands,
  };
}
