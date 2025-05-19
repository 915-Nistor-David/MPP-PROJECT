// src/utils/filters.js
export function filterLoansByInsurance(loans, insuranceFilter) {
    if (insuranceFilter === 'All') return loans;
    return loans.filter(loan => loan.lifeInsurance === insuranceFilter);
  }
  