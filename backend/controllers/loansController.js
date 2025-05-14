// backend/controllers/loansController.js
const { Loan, Borrower } = require('../models');
const { Op } = require('sequelize');

//
// GET /loans
// - optional query params: sort=field, filter=field:value
//
exports.getAllLoans = async (req, res) => {
  try {
    const { sort, filter } = req.query;
    const where = {};

    if (filter) {
      const [field, val] = filter.split(':');
      // basic filtering, you can expand this
      where[field] = { [Op.eq]: val };
    }

    const loans = await Loan.findAll({
      where,
      order: sort ? [[sort, 'ASC']] : undefined,
      include: [{ model: Borrower, as: 'borrower', attributes: ['id','firstName','lastName'] }]
    });

    res.json(loans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//
// GET /loans/:id
//
exports.getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.id, {
      include: [{ model: Borrower, as: 'borrower', attributes: ['id','firstName','lastName'] }]
    });
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    res.json(loan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//
// POST /loans
//
exports.createLoan = async (req, res) => {
  try {
    const { borrowerId, amount, interestRate, dueDate, period, lifeInsurance } = req.body;
    if ([borrowerId, amount, interestRate, dueDate, period, lifeInsurance].some(v => v === undefined)) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const newLoan = await Loan.create({
      borrowerId,
      amount,
      interestRate,
      dueDate,
      period,
      lifeInsurance
    });
    res.status(201).json(newLoan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//
// PATCH /loans/:id
//
exports.updateLoan = async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    await loan.update(req.body);
    res.json(loan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//
// DELETE /loans/:id
//
exports.deleteLoan = async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    await loan.destroy();
    res.json({ message: 'Loan deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
