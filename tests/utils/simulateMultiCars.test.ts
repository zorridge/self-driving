import { simulateMultiCar } from '../../src/utils/simulateMultiCars';

describe('simulateMultiCar', () => {
  it('returns "no collision" when cars never collide', () => {
    // A moves north, B moves east, they never touch
    const input = multiCarInput([
      { id: 'A', position: '0 0 N', commands: 'FFF' },
      { id: 'B', position: '4 4 E', commands: 'FFF' },
    ]);
    expect(simulateMultiCar(input)).toBe('no collision');
  });

  it('detects a collision at the first step', () => {
    // Both try to move to (1,0)
    const input = multiCarInput([
      { id: 'A', position: '0 0 E', commands: 'F' },
      { id: 'B', position: '2 0 W', commands: 'F' },
    ]);
    expect(simulateMultiCar(input)).toBe('A B\n1 0\n1');
  });

  it('detects a collision at a later step', () => {
    // A moves north, B moves south, collide at (2,2) on step 2
    const input = multiCarInput([
      { id: 'A', position: '2 0 N', commands: 'FF' },
      { id: 'B', position: '2 4 S', commands: 'FF' },
    ]);
    expect(simulateMultiCar(input)).toBe('A B\n2 2\n2');
  });

  it('detects multiple collisions at the same step', () => {
    // A and B collide at (1,1), C and D collide at (3,3)
    const input = multiCarInput([
      { id: 'A', position: '1 0 N', commands: 'F' },
      { id: 'B', position: '1 2 S', commands: 'F' },
      { id: 'C', position: '2 3 E', commands: 'F' },
      { id: 'D', position: '4 3 W', commands: 'F' },
    ]);
    expect(simulateMultiCar(input)).toBe('A B\n1 1\n1\n---\nC D\n3 3\n1');
  });

  it('handles cars with different command lengths', () => {
    // Only B moves after step 1, no collision
    const input = multiCarInput([
      { id: 'A', position: '0 0 N', commands: 'F' },
      { id: 'B', position: '0 1 S', commands: 'FF' },
    ]);
    expect(simulateMultiCar(input)).toBe('no collision');
  });

  it('returns error message for invalid input (too few lines)', () => {
    const input = ['5 5', 'A', '1 2 N', 'F', 'B', '3 3 E'].join('\n');
    const result = simulateMultiCar(input);
    expect(result).toMatch(/Input error:/);
    expect(result).toMatch(/Incomplete car definition/);
  });

  it('returns error for invalid command', () => {
    const input = multiCarInput([
      { id: 'A', position: '0 0 N', commands: 'FX' },
      { id: 'B', position: '4 4 E', commands: 'F' },
    ]);
    const result = simulateMultiCar(input);
    expect(result).toMatch(/Input error:/);
    expect(result).toMatch(/Invalid command character: X/);
  });

  it('returns error message for invalid direction', () => {
    const input = multiCarInput([
      { id: 'A', position: '0 0 Z', commands: 'F' },
      { id: 'B', position: '4 4 Z', commands: 'F' },
    ]);
    const result = simulateMultiCar(input);
    expect(result).toMatch(/Input error:/);
    expect(result).toMatch(/Invalid car direction/);
  });

  it('returns error for car out of bounds', () => {
    const input = multiCarInput([
      { id: 'A', position: '6 2 N', commands: 'F' },
      { id: 'B', position: '3 3 E', commands: 'F' },
    ]);
    const result = simulateMultiCar(input);
    expect(result).toMatch(/Input error:/);
    expect(result).toMatch(/Invalid car position/);
  });

  it('returns error for duplicate car IDs', () => {
    const input = multiCarInput([
      { id: 'A', position: '0 0 N', commands: 'F' },
      { id: 'A', position: '4 4 E', commands: 'F' },
    ]);
    const result = simulateMultiCar(input);
    expect(result).toMatch(/Input error:/);
    expect(result).toMatch(/Duplicate car IDs/);
  });

  it('returns error for initial position collision', () => {
    const input = multiCarInput([
      { id: 'A', position: '1 1 N', commands: 'F' },
      { id: 'B', position: '1 1 E', commands: 'F' },
    ]);
    const result = simulateMultiCar(input);
    expect(result).toMatch(/Input error:/);
    expect(result).toMatch(/cannot start at the same position/);
  });
});

function multiCarInput(
  cars: Array<{ id: string; position: string; commands: string }>,
  field = '5 5',
) {
  return [
    field,
    ...cars.flatMap((car) => [car.id, car.position, car.commands]),
  ].join('\n');
}
