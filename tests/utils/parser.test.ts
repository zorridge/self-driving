import {
  parseSingleCarInput,
  parseMultiCarInput,
} from '../../src/utils/parser';
import { Direction, Command } from '../../src/types';
import { Field } from '../../src/entities/Field';

describe('parseSingleCarInput', () => {
  it('parses a valid single car input', () => {
    const result = parseSingleCarInput(validSingleInput);
    expect(result.field).toEqual(new Field(5, 5));
    expect(result.car.id).toBe('0');
    expect(result.car.car.position).toEqual({ x: 1, y: 2 });
    expect(result.car.car.direction).toBe(Direction.N);
    expect(result.car.commands).toEqual([
      Command.Left,
      Command.Forward,
      Command.Right,
      Command.Forward,
    ]);
  });

  it('throws on too few lines', () => {
    expect(() => parseSingleCarInput(tooFewLinesInput)).toThrow(
      'Input must have at least 3 lines: field size, car position/direction, commands.',
    );
  });

  it('throws on invalid field size', () => {
    expect(() => parseSingleCarInput(invalidFieldInput)).toThrow(
      'Invalid field size. Width and height must be positive integers.',
    );
  });

  it('throws on invalid car position', () => {
    expect(() => parseSingleCarInput(invalidPositionInput)).toThrow(
      'Invalid car position. Position must be within field bounds.',
    );
  });

  it('throws on invalid direction', () => {
    expect(() => parseSingleCarInput(invalidDirectionInput)).toThrow(
      'Invalid car direction. Must be N, E, S, or W.',
    );
  });

  it('throws on invalid command character', () => {
    expect(() => parseSingleCarInput(invalidCommandInput)).toThrow(
      'Invalid command character: X',
    );
  });
});

describe('parseMultiCarInput', () => {
  it('parses valid multi-car input', () => {
    const result = parseMultiCarInput(validMultiInput);
    expect(result.field).toEqual(new Field(5, 5));
    expect(result.cars.length).toBe(2);

    expect(result.cars[0].id).toBe('A');
    expect(result.cars[0].car.position).toEqual({ x: 1, y: 2 });
    expect(result.cars[0].car.direction).toBe(Direction.N);
    expect(result.cars[0].commands).toEqual([
      Command.Left,
      Command.Forward,
      Command.Right,
      Command.Forward,
    ]);

    expect(result.cars[1].id).toBe('B');
    expect(result.cars[1].car.position).toEqual({ x: 3, y: 3 });
    expect(result.cars[1].car.direction).toBe(Direction.E);
    expect(result.cars[1].commands).toEqual([
      Command.Forward,
      Command.Forward,
      Command.Left,
    ]);
  });

  it('throws on too few lines', () => {
    expect(() => parseMultiCarInput(tooFewLinesMultiInput)).toThrow(
      'Input must have at least 4 lines for multi-car simulation.',
    );
  });

  it('throws on invalid car position', () => {
    expect(() => parseMultiCarInput(invalidCarPositionMultiInput)).toThrow(
      'Invalid car position. Position must be within field bounds.',
    );
  });

  it('throws on invalid direction', () => {
    expect(() => parseMultiCarInput(invalidDirectionMultiInput)).toThrow(
      'Invalid car direction. Must be N, E, S, or W.',
    );
  });

  it('throws on invalid command character', () => {
    expect(() => parseMultiCarInput(invalidCommandMultiInput)).toThrow(
      'Invalid command character: X',
    );
  });

  it('throws on empty car ID', () => {
    expect(() => parseMultiCarInput(emptyIdMultiInput)).toThrow(
      'Car ID cannot be empty.',
    );
  });

  it('throws on incomplete car definition', () => {
    expect(() => parseMultiCarInput(incompleteCarMultiInput)).toThrow(
      'Incomplete car definition.',
    );
  });

  it('throws on duplicate car IDs', () => {
    expect(() => parseMultiCarInput(duplicateIdMultiInput)).toThrow(
      'Duplicate car IDs are not allowed.',
    );
  });

  it('throws on car position collision', () => {
    expect(() => parseMultiCarInput(positionCollisionMultiInput)).toThrow(
      'Two cars cannot start at the same position.',
    );
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

function multiCarInput(
  cars: Array<{ id: string; position: string; commands: string }>,
  field = '5 5',
) {
  return [
    field,
    ...cars.flatMap((car) => [car.id, car.position, car.commands]),
  ].join('\n');
}

// --- Constants for common test cases ---

const validSingleInput = singleCarInput();
const invalidFieldInput = singleCarInput({ field: '0 5' });
const invalidPositionInput = singleCarInput({ position: '5 2 N' });
const invalidDirectionInput = singleCarInput({ position: '1 2 Z' });
const invalidCommandInput = singleCarInput({ commands: 'LXF' });
const tooFewLinesInput = '5 5\n1 2 N';

const validMultiInput = multiCarInput([
  { id: 'A', position: '1 2 N', commands: 'LFRF' },
  { id: 'B', position: '3 3 E', commands: 'FFL' },
]);
const tooFewLinesMultiInput = '5 5\nA\n1 2 N';
const emptyIdMultiInput = multiCarInput([
  { id: ' ', position: '1 2 N', commands: 'LFRF' },
  { id: 'B', position: '3 3 E', commands: 'FFL' },
]);
const incompleteCarMultiInput = [
  '5 5',
  'A',
  '1 2 N',
  'LFRF',
  'B',
  '3 3 E',
].join('\n');
const duplicateIdMultiInput = multiCarInput([
  { id: 'A', position: '1 2 N', commands: 'LFRF' },
  { id: 'A', position: '3 3 E', commands: 'FFL' },
]);
const positionCollisionMultiInput = multiCarInput([
  { id: 'A', position: '1 2 N', commands: 'LFRF' },
  { id: 'B', position: '1 2 E', commands: 'FFL' },
]);
const invalidCarPositionMultiInput = multiCarInput([
  { id: 'A', position: '6 2 N', commands: 'LFRF' },
  { id: 'B', position: '3 3 E', commands: 'FFL' },
]);
const invalidDirectionMultiInput = multiCarInput([
  { id: 'A', position: '1 2 Z', commands: 'LFRF' },
  { id: 'B', position: '3 3 E', commands: 'FFL' },
]);
const invalidCommandMultiInput = multiCarInput([
  { id: 'A', position: '1 2 N', commands: 'LXRF' },
  { id: 'B', position: '3 3 E', commands: 'FFL' },
]);
