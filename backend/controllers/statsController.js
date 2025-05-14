// backend/controllers/statsController.js
const { Loan, Borrower, sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

exports.getBorrowerLoanStats = async (req, res) => {
  try {
    // 1) total loans & sum & avg
    const totals = await sequelize.query(`
      SELECT
        COUNT(*)             AS totalLoans,
        SUM(amount)          AS sumAmount,
        AVG(amount)          AS avgAmount
      FROM Loans
    `, { type: QueryTypes.SELECT }).then(r => r[0]);

    // 2) top 10 borrowers by loan sum
    const topBorrowers = await sequelize.query(`
      SELECT
        b.id,
        b.firstName,
        b.lastName,
        SUM(l.amount) AS totalBorrowed,
        COUNT(l.id)   AS loanCount
      FROM Loans l
      JOIN Borrowers b ON b.id = l.borrowerId
      GROUP BY b.id, b.firstName, b.lastName
      ORDER BY totalBorrowed DESC
      LIMIT 10
    `, { type: QueryTypes.SELECT });

    // 3) interest-rate distribution
    const rateDist = await sequelize.query(`
      SELECT
        CASE
          WHEN interestRate < 5 THEN '< 5%'
          WHEN interestRate BETWEEN 5 AND 10 THEN '5–10%'
          ELSE '> 10%'
        END AS bucket,
        COUNT(*) AS count
      FROM Loans
      GROUP BY bucket
    `, { type: QueryTypes.SELECT });

    res.json({ totals, topBorrowers, rateDist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
