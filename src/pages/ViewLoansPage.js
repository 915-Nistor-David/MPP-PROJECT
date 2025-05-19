// src/pages/ViewLoansPage.js
import React, { useEffect, useRef, useState } from 'react';
import LoanCharts from '../components/LoanCharts';
import { fetchLoansPage, subscribeNewLoans } from '../utils/loanService';
import './ViewLoansPage.css';

const PAGE_SIZE = 50;

export default function ViewLoansPage() {
  const [loans, setLoans]       = useState([]);
  const [page,  setPage]        = useState(1);
  const [total, setTotal]       = useState(0);
  const [sort,      setSort]      = useState('id');
  const [dir,       setDir]       = useState('ASC');
  const [search,    setSearch]    = useState('');
  const [insurance, setInsurance] = useState('all');
  const loading = useRef(false);

  // Load a page of data
  async function loadPage(p) {
    if (loading.current) return;
    loading.current = true;
    try {
      const { data, total: newTotal } = await fetchLoansPage({
        page: p,
        size: PAGE_SIZE,
        sort,
        dir,
        search,
        insurance,
      });
      setLoans(prev => [...prev, ...data]);
      setTotal(newTotal);
      setPage(p);
    } catch (err) {
      console.error(err);
      // optionally show user error…
    } finally {
      loading.current = false;
    }
  }

  // Reset & fetch first page whenever filters change
  useEffect(() => {
    setLoans([]);
    loadPage(1);
  }, [sort, dir, search, insurance]);

  // Infinite scroll
  useEffect(() => {
    const onScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
      if (nearBottom && loans.length < total && !loading.current) {
        loadPage(page + 1);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [loans, total, page]);

  // Live WebSocket updates
  useEffect(() => {
    const unsubscribe = subscribeNewLoans(loan =>
      setLoans(prev => [loan, ...prev])
    );
    return unsubscribe;
  }, []);

  return (
    <div className="view-loans-container">
      <h2>All Loans (Live + Lazy Load)</h2>

      <div className="controls">
        <input
          placeholder="Search borrower…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          value={insurance}
          onChange={e => setInsurance(e.target.value)}
        >
          <option value="all">All</option>
          <option value="yes">Insurance Yes</option>
          <option value="no">Insurance No</option>
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="id">Id</option>
          <option value="amount">Amount</option>
          <option value="interestRate">Rate</option>
        </select>
        <button onClick={() => setDir(d => (d === 'ASC' ? 'DESC' : 'ASC'))}>
          {dir === 'ASC' ? '↑' : '↓'}
        </button>
      </div>

      <table className="loans-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Borrower</th>
            <th>Email</th>
            <th>Amount</th>
            <th>Rate %</th>
            <th>Due</th>
            <th>Period</th>
            <th>Ins.</th>
          </tr>
        </thead>
        <tbody>
          {loans.map(l => (
            <tr key={l.id}>
              <td>{l.id}</td>
              <td>
                {l.borrower.firstName} {l.borrower.lastName}
              </td>
              <td>{l.borrower.email}</td>
              <td>{l.amount}</td>
              <td>{l.interestRate}</td>
              <td>{l.dueDate}</td>
              <td>{l.period}</td>
              <td>{l.lifeInsurance ? 'yes' : 'no'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ textAlign: 'center', margin: '1rem' }}>
        {loans.length}/{total} loaded&nbsp;
        {loading.current && '…'}
      </p>

      <LoanCharts loans={loans} />
    </div>
  );
}
