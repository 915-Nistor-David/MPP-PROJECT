// src/utils/validators.js
export function isValidDueDate(dueDate) {
    // dueDate is expected to be a string (from a select input)
    const allowedDays = [1, 3, 10, 13, 15];
    const day = parseInt(dueDate, 10);
    return allowedDays.includes(day);
  }
  