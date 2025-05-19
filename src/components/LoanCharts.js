// src/components/LoanCharts.js
import React, { useEffect, useState, useRef } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function LoanCharts({ loans }) {
  // — 1) Bar data: <1000, 1000–5000, >5000
  const lowCount  = loans.filter(l => l.amount < 1000).length;
  const midCount  = loans.filter(l => l.amount >= 1000 && l.amount <= 5000).length;
  const highCount = loans.filter(l => l.amount > 5000).length;

  const barData = {
    labels: ['< 1000', '1000 - 5000', '> 5000'],
    datasets: [{
      label: 'Number of Loans',
      data: [lowCount, midCount, highCount],
      backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
    }]
  };

  // — 2) Pie data: lifeInsurance yes/no (case-insensitive)
  const yesCount = loans.filter(
    l => l.lifeInsurance?.toString().toLowerCase() === 'yes'
  ).length;
  const noCount  = loans.filter(
    l => l.lifeInsurance?.toString().toLowerCase() === 'no'
  ).length;

  const pieData = {
    labels: ['Insurance: Yes', 'Insurance: No'],
    datasets: [{
      data: [yesCount, noCount],
      backgroundColor: ['#2196f3', '#9e9e9e']
    }]
  };

  // — 3) Line data: average loan amount over time
  // We’ll drive it on a 5s interval and keep appending.
  const [lineData, setLineData] = useState({
    labels: [],
    datasets: [{
      label: 'Average Loan Amount',
      data: [],
      fill: false,
      borderColor: '#3f51b5',
      tension: 0.1,
    }]
  });

  // Use a ref to hold our “time” so it doesn’t reset on every props change
  const timeRef = useRef(0);

  useEffect(() => {
    const iv = setInterval(() => {
      timeRef.current += 5;
      const avg = loans.length
        ? (loans.reduce((sum, l) => sum + l.amount, 0) / loans.length).toFixed(2)
        : 0;

      setLineData(prev => ({
        labels: [...prev.labels, `${timeRef.current}s`],
        datasets: [{
          ...prev.datasets[0],
          data: [...prev.datasets[0].data, avg]
        }]
      }));
    }, 5000);

    return () => clearInterval(iv);
  }, [/* no deps: run only once on mount */]);

  return (
    <div style={{ marginTop: 40 }}>
      <h3 style={{ textAlign: 'center', marginBottom: 20 }}>Loan Charts</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40 }}>
        {/* Bar Chart */}
        <div style={{ flex: '1 1 300px' }}>
          <Bar
            data={barData}
            options={{
              plugins: { title: { display: true, text: 'Loan Amount Distribution' } }
            }}
          />
        </div>

        {/* Pie Chart */}
        <div style={{ flex: '1 1 300px' }}>
          <Pie
            data={pieData}
            options={{
              plugins: { title: { display: true, text: 'Life Insurance Distribution' } }
            }}
          />
        </div>

        {/* Line Chart */}
        <div style={{ flex: '1 1 300px' }}>
          <Line
            data={lineData}
            options={{
              plugins: { title: { display: true, text: 'Average Loan Amount Over Time' } },
              animation: false  // keep it snappy
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default LoanCharts;
