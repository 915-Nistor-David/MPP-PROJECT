// backend/routes/loans.js

const express = require('express');
const { Op } = require('sequelize');
const { Loan, Borrower } = require('../models');
const router = express.Router();

// CREATE a new loan
router.post('/', async (req, res) => {
  const { borrowerId, amount, interestRate, dueDate, period, lifeInsurance } = req.body;

  // server‐side check
  if (
    borrowerId == null ||
    amount == null ||
    interestRate == null ||
    !dueDate ||
    period == null
  ) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const loan = await Loan.create({
      borrowerId,
      amount,
      interestRate,
      dueDate,             // "YYYY-MM-DD"
      period,
      lifeInsurance: Boolean(lifeInsurance)
    });
    // fetch back with borrower included
    const full = await Loan.findByPk(loan.id, { include: ['borrower'] });
    return res.status(201).json(full);
  } catch (err) {
    console.error('Failed to create loan:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// READ all loans (with optional pagination/filter/sort)
router.get('/', async (req, res) => {
  const page  = +req.query.page || 1;
  const size  = +req.query.size || 50;
  const sort  = req.query.sort || 'id';
  const dir   = req.query.dir === 'DESC' ? 'DESC' : 'ASC';
  const search= req.query.search || '';
  const insurance = req.query.insurance;

  // build filters
  const whereLoan = {};
  if (insurance === 'yes') whereLoan.lifeInsurance = true;
  if (insurance === 'no')  whereLoan.lifeInsurance = false;

  const whereBorrower = search
    ? { [Op.or]: [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName : { [Op.like]: `%${search}%` } },
        { email    : { [Op.like]: `%${search}%` } }
      ] }
    : undefined;

  try {
    const { count, rows } = await Loan.findAndCountAll({
      where: whereLoan,
      include: [{
        model: Borrower,
        as: 'borrower',
        where: whereBorrower,
        attributes: ['id','firstName','lastName','email']
      }],
      offset: (page - 1) * size,
      limit: size,
      order: [[sort, dir]]
    });
    res.json({ total: count, page, size, data: rows });
  } catch (err) {
    console.error('Failed to fetch loans:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// other CRUD (GET/:id, PATCH/:id, DELETE/:id) remain unchanged...
module.exports = router;
