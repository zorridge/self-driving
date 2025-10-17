import { Car } from '../entities/Car';
import { parseMultiCarInput } from './parser';

interface CarState {
  id: string;
  car: Car;
  commands: string[];
  commandIndex: number;
}

type CollisionState = {
  ids: string[];
  position: { x: number; y: number };
} | null;

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

  let step = 0;
  let collision: CollisionState = null;

  // Find the longest command list
  const maxSteps = Math.max(...states.map((s) => s.commands.length));

  while (step < maxSteps && !collision) {
    // Determine intended moves
    const intendedPositions: Map<string, { x: number; y: number }> = new Map();
    const positionToIds: Map<string, string[]> = new Map();

    // First, compute each car's intended position
    for (const state of states) {
      let intended = { ...state.car.position };
      if (state.commandIndex < state.commands.length) {
        const cmd = state.commands[state.commandIndex];
        if (cmd === 'L' || cmd === 'R') {
          // Rotation doesn't change position
        } else if (cmd === 'F') {
          const nextPos = state.car.getNextPosition();
          if (field.isWithinBounds(nextPos)) {
            intended = nextPos;
          }
        }
      }
      intendedPositions.set(state.id, intended);

      const posKey = `${intended.x},${intended.y}`;
      if (!positionToIds.has(posKey)) positionToIds.set(posKey, []);
      positionToIds.get(posKey)!.push(state.id);
    }

    // Check for collision: more than one car intends to move to the same position
    for (const [posKey, ids] of positionToIds.entries()) {
      if (ids.length > 1) {
        const [x, y] = posKey.split(',').map(Number);
        collision = { ids, position: { x, y } };
        break;
      }
    }

    if (collision) break;

    // No collision: execute moves
    for (const state of states) {
      if (state.commandIndex < state.commands.length) {
        const cmd = state.commands[state.commandIndex];
        if (cmd === 'L' || cmd === 'R') {
          state.car.rotate(cmd as 'L' | 'R');
        } else if (cmd === 'F') {
          state.car.moveForward(field);
        }
        // Ignore invalid commands
      }
      state.commandIndex += 1;
    }

    step += 1;
  }

  if (collision) {
    // Output: IDs, position, step (1-based)
    return (
      `${collision.ids.join(' ')}` +
      '\n' +
      `${collision.position.x} ${collision.position.y}` +
      '\n' +
      `${step + 1}`
    );
  } else {
    return 'No collision';
  }
}
