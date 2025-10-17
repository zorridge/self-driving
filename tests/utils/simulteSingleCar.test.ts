import { simulateSingleCar } from '../../src/utils/simulateSingleCar';

describe('simulateSingleCar', () => {
  it('returns final position and direction for valid input', () => {
    // Start at (1,2) facing North, commands: L F R F
    // L -> W, F -> (0,2), R -> N, F -> (0,3)
    const input = singleCarInput({ position: '1 2 N', commands: 'LFRF' });
    expect(simulateSingleCar(input)).toBe('0 3 N');
  });

  it('handles moving out of bounds (car stays in place)', () => {
    // Start at (0,0) facing South, commands: F F F
    const input = singleCarInput({ position: '0 0 S', commands: 'FFF' });
    expect(simulateSingleCar(input)).toBe('0 0 S');
  });

  it('handles rotation only', () => {
    // Start at (2,2) facing East, commands: L L L L (full rotation)
    const input = singleCarInput({ position: '2 2 E', commands: 'LLLL' });
    expect(simulateSingleCar(input)).toBe('2 2 E');
  });

  it('returns error message for invalid input (too few lines)', () => {
    const input = '5 5\n1 2 N';
    const result = simulateSingleCar(input);
    expect(result).toMatch(/Input error:/);
    expect(result).toMatch(/Input must have at least 3 lines/);
  });

  it('returns error message for invalid command', () => {
    const input = singleCarInput({ commands: 'FXF' });
    const result = simulateSingleCar(input);
    expect(result).toMatch(/Input error:/);
    expect(result).toMatch(/Invalid command character: X/);
  });

  it('returns error message for invalid direction', () => {
    const input = singleCarInput({ position: '1 2 Z' });
    const result = simulateSingleCar(input);
    expect(result).toMatch(/Input error:/);
    expect(result).toMatch(/Invalid car direction/);
  });

  it('returns error message for car out of bounds', () => {
    const input = singleCarInput({ position: '6 2 N' });
    const result = simulateSingleCar(input);
    expect(result).toMatch(/Input error:/);
    expect(result).toMatch(/Invalid car position/);
  });

  it('returns error message for invalid field size', () => {
    const input = singleCarInput({ field: '0 5' });
    const result = simulateSingleCar(input);
    expect(result).toMatch(/Input error:/);
    expect(result).toMatch(/Invalid field size/);
  });
});

// --- Helper functions for input construction ---

function singleCarInput({
  field = '5 5',
  position = '1 2 N',
  commands = 'LFRF',
} = {}) {
  return `${field}\n${position}\n${commands}`;
}
