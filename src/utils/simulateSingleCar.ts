import { parseSingleCarInput } from './parser';

export function simulateSingleCar(input: string): string {
  let parsed;
  try {
    parsed = parseSingleCarInput(input);
  } catch (err) {
    return `Input error: ${(err as Error).stack}`;
  }

  const {
    field,
    car: { car, commands },
  } = parsed;

  for (const cmd of commands) {
    car.executeCommand(cmd, field);
  }

  return `${car.position.x} ${car.position.y} ${car.direction}`;
}
