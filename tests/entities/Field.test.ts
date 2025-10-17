import { Field } from '../../src/entities/Field';

describe('Field', () => {
  describe('isWithinBounds', () => {
    const field = new Field(5, 5);

    it('returns true for positions inside bounds', () => {
      expect(field.isWithinBounds({ x: 0, y: 0 })).toBe(true);
      expect(field.isWithinBounds({ x: 4, y: 4 })).toBe(true);
    });

    it('returns false for positions outside bounds', () => {
      expect(field.isWithinBounds({ x: -1, y: 0 })).toBe(false);
      expect(field.isWithinBounds({ x: 0, y: -1 })).toBe(false);
      expect(field.isWithinBounds({ x: 5, y: 0 })).toBe(false);
      expect(field.isWithinBounds({ x: 0, y: 5 })).toBe(false);
      expect(field.isWithinBounds({ x: 10, y: 10 })).toBe(false);
    });
  });
});
