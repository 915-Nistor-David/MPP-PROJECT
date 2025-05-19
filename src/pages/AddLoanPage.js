// src/pages/AddLoanPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate }            from 'react-router-dom';
import './AddLoanPage.css';

function AddLoanPage({ opQueue }) {
  const [borrowers, setBorrowers] = useState([]);
  const [loan, setLoan] = useState({
    borrowerId: '',
    amount: '',
    interestRate: '',
    dueDate: '',
    period: '',
    lifeInsurance: 'no'
  });
  const navigate = useNavigate();

  // load borrowers for the <select>
  useEffect(() => {
    fetch('http://localhost:3001/borrowers')
      .then(r => r.json())
      .then(setBorrowers)
      .catch(console.error);
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();

    const payload = {
      borrowerId:   Number(loan.borrowerId),
      amount:       Number(loan.amount),
      interestRate: Number(loan.interestRate),
      dueDate:      loan.dueDate,
      period:       Number(loan.period),
      lifeInsurance: loan.lifeInsurance === 'yes'
    };

    if (!navigator.onLine) {
      opQueue.enqueue({ type:'create', endpoint:'/loans', data:payload });
      alert('Offline: queued for sync.');
    } else {
      try {
        const res = await fetch('http://localhost:3001/loans',{
          method:'POST',
          headers:{ 'Content-Type':'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(await res.text());
        alert('Loan created!');
        navigate('/view-loans');
      } catch(err) {
        console.error(err);
        opQueue.enqueue({ type:'create', endpoint:'/loans', data:payload });
        alert('Server error: queued for sync.');
      }
    }
  };

  return (
    <div className="add-loan-container">
      <h2>Add New Loan</h2>
      <form onSubmit={handleSubmit}>
        {/* Borrower */}
        <div className="form-group">
          <label>Borrower*:</label>
          <select
            required
            value={loan.borrowerId}
            onChange={e => setLoan({...loan, borrowerId:e.target.value})}
          >
            <option value="">Select…</option>
            {borrowers.map(b => (
              <option key={b.id} value={b.id}>
                {b.firstName} {b.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div className="form-group">
          <label>Amount*:</label>
          <input
            type="number"
            step="0.01"
            required
            value={loan.amount}
            onChange={e => setLoan({...loan, amount:e.target.value})}
          />
        </div>

        {/* Interest Rate */}
        <div className="form-group">
          <label>Interest Rate (%)*:</label>
          <input
            type="number" step="0.01" required
            value={loan.interestRate}
            onChange={e => setLoan({...loan, interestRate:e.target.value})}
          />
        </div>

        {/* Due Date */}
        <div className="form-group">
          <label>Due Date*:</label>
          <input
            type="date"
            required
            value={loan.dueDate}
            onChange={e => setLoan({...loan, dueDate:e.target.value})}
          />
        </div>

        {/* Period */}
        <div className="form-group">
          <label>Period (months)*:</label>
          <input
            type="number" required
            value={loan.period}
            onChange={e => setLoan({...loan, period:e.target.value})}
          />
        </div>

        {/* Life Insurance */}
        <div className="form-group">
          <label>Life Insurance*:</label>
          <select
            required
            value={loan.lifeInsurance}
            onChange={e => setLoan({...loan, lifeInsurance:e.target.value})}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <button type="submit" className="button-submit">
          Submit Loan
        </button>
      </form>
    </div>
  );
}

export default AddLoanPage;
