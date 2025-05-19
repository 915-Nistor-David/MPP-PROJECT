// src/utils/filters.test.js
import { filterLoansByInsurance } from './filters';

const mockLoans = [
  { id: 1, lifeInsurance: 'Yes' },
  { id: 2, lifeInsurance: 'No' },
  { id: 3, lifeInsurance: 'Yes' },
  { id: 4, lifeInsurance: 'No' },
];

describe('filterLoansByInsurance', () => {
  it('should return all loans when filter is "All"', () => {
    expect(filterLoansByInsurance(mockLoans, 'All')).toEqual(mockLoans);
  });

  it('should return only loans with lifeInsurance "Yes"', () => {
    expect(filterLoansByInsurance(mockLoans, 'Yes')).toEqual([
      { id: 1, lifeInsurance: 'Yes' },
      { id: 3, lifeInsurance: 'Yes' },
    ]);
  });

  it('should return only loans with lifeInsurance "No"', () => {
    expect(filterLoansByInsurance(mockLoans, 'No')).toEqual([
      { id: 2, lifeInsurance: 'No' },
      { id: 4, lifeInsurance: 'No' },
    ]);
  });
});
