// src/utils/validators.test.js
import { isValidDueDate } from './validators';

describe('isValidDueDate', () => {
  it('should return true for allowed due date values', () => {
    expect(isValidDueDate("1")).toBe(true);
    expect(isValidDueDate("3")).toBe(true);
    expect(isValidDueDate("10")).toBe(true);
    expect(isValidDueDate("13")).toBe(true);
    expect(isValidDueDate("15")).toBe(true);
  });

  it('should return false for disallowed due date values', () => {
    expect(isValidDueDate("2")).toBe(false);
    expect(isValidDueDate("4")).toBe(false);
    expect(isValidDueDate("20")).toBe(false);
    expect(isValidDueDate("")).toBe(false);
    expect(isValidDueDate("abc")).toBe(false);
  });
});
