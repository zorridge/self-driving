import { Car } from '../../src/entities/Car';
import { Field } from '../../src/entities/Field';
import { Command, Direction } from '../../src/types';

describe('Car', () => {
  let field: Field;

  beforeEach(() => {
    field = new Field(5, 5);
  });

  describe('getIntendedPosition', () => {
    it('returns correct position for movement within bounds', () => {
      const car = new Car({ x: 2, y: 2 }, Direction.N);
      expect(car.getIntendedPosition(Command.Forward, field)).toEqual({
        x: 2,
        y: 3,
      });
    });

    it('returns current position for movement out of bounds', () => {
      const car = new Car({ x: 4, y: 4 }, Direction.E);
      expect(car.getIntendedPosition(Command.Forward, field)).toEqual({
        x: 4,
        y: 4,
      });
    });

    it('returns current position for rotation', () => {
      const car = new Car({ x: 2, y: 2 }, Direction.N);
      expect(car.getIntendedPosition(Command.Left, field)).toEqual({
        x: 2,
        y: 2,
      });
      expect(car.getIntendedPosition(Command.Right, field)).toEqual({
        x: 2,
        y: 2,
      });
    });
  });

  describe('executeCommand', () => {
    it('moves forward within bounds', () => {
      const car = new Car({ x: 2, y: 2 }, Direction.W);
      car.executeCommand(Command.Forward, field);
      expect(car.position).toEqual({ x: 1, y: 2 });
    });

    it('does not move forward out of bounds', () => {
      const car = new Car({ x: 0, y: 0 }, Direction.S);
      car.executeCommand(Command.Forward, field);
      expect(car.position).toEqual({ x: 0, y: 0 });
    });

    it('rotates left', () => {
      const car = new Car({ x: 2, y: 2 }, Direction.N);
      car.executeCommand(Command.Left, field);
      expect(car.direction).toBe(Direction.W);
    });

    it('rotates right', () => {
      const car = new Car({ x: 2, y: 2 }, Direction.N);
      car.executeCommand(Command.Right, field);
      expect(car.direction).toBe(Direction.E);
    });
  });
});
