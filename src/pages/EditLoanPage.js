// src/pages/EditLoanPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditLoanPage.css';

function EditLoanPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Allowed days for due date selection
  const allowedDays = [1, 3, 10, 13, 15];

  // Local state for loan fields
  const [loan, setLoan] = useState(null);
  const [name, setName] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [lifeInsurance, setLifeInsurance] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch loan details using fetch() on component mount
  useEffect(() => {
    fetch(`http://localhost:3001/loans/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Loan not found');
        }
        return res.json();
      })
      .then((data) => {
        setLoan(data);
        setName(data.name);
        setInterestRate(data.interestRate?.toString() || '');
        // Assuming dueDate is stored as a day (number), convert it to string
        setDueDate(data.dueDate?.toString() || '');
        setLifeInsurance(data.lifeInsurance || '');
        setLoading(false);
      })
      .catch((err) => {
        alert(err.message);
        setLoading(false);
        navigate('/view-loans');
      });
  }, [id, navigate]);

  const handleUpdate = (e) => {
    e.preventDefault();

    // Validate fields
    if (!name) {
      alert('Name is required.');
      return;
    }
    const rate = parseFloat(interestRate);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      alert('Interest rate must be between 0 and 100.');
      return;
    }
    if (!dueDate) {
      alert('Please select a due date.');
      return;
    }
    const day = parseInt(dueDate, 10);
    if (!allowedDays.includes(day)) {
      alert('Due date must be one of: 1, 3, 10, 13, or 15.');
      return;
    }
    if (!lifeInsurance) {
      alert('Please select Yes or No for life insurance.');
      return;
    }

    // Prepare updated data; we update only these fields for simplicity.
    const updatedData = {
      name,
      interestRate: rate,
      dueDate: day,
      lifeInsurance,
    };

    // Use fetch() to PATCH the loan on the backend.
    fetch(`http://localhost:3001/loans/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to update loan');
        }
        return res.json();
      })
      .then(() => {
        alert('Loan updated successfully!');
        navigate('/view-loans');
      })
      .catch((error) => {
        alert('Error updating loan: ' + error.message);
      });
  };

  if (loading) return <div className="edit-loan-container">Loading loan...</div>;
  if (!loan) return <div className="edit-loan-container">Loan not found!</div>;

  return (
    <div className="edit-loan-container">
      <div className="edit-loan-header">
        <h2>Edit Loan</h2>
        <p>Update name, interest rate, due date, and life insurance below.</p>
      </div>
      <form onSubmit={handleUpdate} className="edit-loan-form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Interest Rate (%):</label>
          <input
            type="number"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Due Date (day of the month):</label>
          <select value={dueDate} onChange={(e) => setDueDate(e.target.value)}>
            <option value="">-- Select --</option>
            {allowedDays.map((day) => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Life Insurance:</label>
          <select
            value={lifeInsurance}
            onChange={(e) => setLifeInsurance(e.target.value)}
          >
            <option value="">-- Select --</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <button type="submit" className="button-submit">Update</button>
      </form>
    </div>
  );
}

export default EditLoanPage;
