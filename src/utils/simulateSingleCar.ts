import { parseSingleCarInput } from './parser';

export function simulateSingleCar(input: string): string {
  let parsed;
  try {
    parsed = parseSingleCarInput(input);
  } catch (err) {
    return `Input error: ${(err as Error).message}`;
  }
  const {
    field,
    car: { car, commands },
  } = parsed;

  for (const cmd of commands) {
    if (cmd === 'L' || cmd === 'R') {
      car.rotate(cmd as 'L' | 'R');
    } else if (cmd === 'F') {
      car.moveForward(field);
    }
    // Ignore invalid commands (should be caught by validation)
  }

  return `${car.position.x} ${car.position.y} ${car.direction}`;
}
