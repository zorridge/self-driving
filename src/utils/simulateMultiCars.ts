import { Car } from '../entities/Car';
import { Command, Position } from '../types';
import { parseMultiCarInput } from './parser';

interface CarState {
  id: string;
  car: Car;
  commands: Command[];
  commandIndex: number;
}

type CollisionState = {
  ids: string[];
  position: Position;
};

export function simulateMultiCar(input: string): string {
  let parsed;
  try {
    parsed = parseMultiCarInput(input);
  } catch (err) {
    return `Input error: ${(err as Error).message}`;
  }

  const { field, cars } = parsed;

  // Setup initial states
  const states: CarState[] = cars.map((carInput) => ({
    id: carInput.id,
    car: new Car({ ...carInput.car.position }, carInput.car.direction),
    commands: carInput.commands,
    commandIndex: 0,
  }));

  // Find the longest command list
  const maxSteps = Math.max(...states.map((s) => s.commands.length));
  let step = 0;

  while (step < maxSteps) {
    const collisions: CollisionState[] = [];

    // Determine intended moves for this step
    const intendedPositions: Map<string, Position> = new Map();
    const positionToIds: Map<string, string[]> = new Map();

    for (const state of states) {
      const cmd =
        state.commandIndex < state.commands.length
          ? state.commands[state.commandIndex]
          : null;

      const intended = cmd
        ? state.car.getIntendedPosition(cmd, field)
        : state.car.position;

      intendedPositions.set(state.id, intended);

      const posKey = `${intended.x},${intended.y}`;
      if (!positionToIds.has(posKey)) positionToIds.set(posKey, []);
      positionToIds.get(posKey)!.push(state.id);
    }

    // Check for collision: more than one car intends to move to the same position
    for (const [posKey, ids] of positionToIds.entries()) {
      if (ids.length > 1) {
        const [x, y] = posKey.split(',').map(Number);
        collisions.push({ ids, position: { x, y } });
      }
    }

    if (collisions.length > 0) {
      return collisions
        .map(
          (col) =>
            `${col.ids.join(' ')}` +
            '\n' +
            `${col.position.x} ${col.position.y}` +
            '\n' +
            `${step + 1}`,
        )
        .join('\n---\n');
    }

    // No collision: execute moves
    for (const state of states) {
      if (state.commandIndex < state.commands.length) {
        const cmd = state.commands[state.commandIndex];
        state.car.executeCommand(cmd, field);
      }
      state.commandIndex += 1;
    }

    step += 1;
  }

  return 'no collision';
}
