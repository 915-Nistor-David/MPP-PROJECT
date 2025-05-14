const express = require('express');
const { Borrower, Loan } = require('../models');
const router = express.Router();

// Create
router.post('/', async (req, res) => {
  const b = await Borrower.create(req.body);
  res.status(201).json(b);
});

// Read all (with optional ?sort=firstName or ?filter=email:foo)
router.get('/', async (req, res) => {
  const { sort, filter } = req.query;
  let where = {};
  if (filter) {
    const [field, val] = filter.split(':');
    where[field] = val;
  }
  let borrowers = await Borrower.findAll({
    where,
    order: sort ? [[sort, 'ASC']] : undefined,
    include: [{ model: Loan, as: 'loans' }]
  });
  res.json(borrowers);
});

// Read one
router.get('/:id', async (req, res) => {
  const b = await Borrower.findByPk(req.params.id, {
    include: [{ model: Loan, as: 'loans' }]
  });
  if (!b) return res.status(404).json({ message: 'Not found' });
  res.json(b);
});

// Update
router.patch('/:id', async (req, res) => {
  const b = await Borrower.findByPk(req.params.id);
  if (!b) return res.status(404).json({ message: 'Not found' });
  await b.update(req.body);
  res.json(b);
});

// Delete
router.delete('/:id', async (req, res) => {
  const b = await Borrower.findByPk(req.params.id);
  if (!b) return res.status(404).json({ message: 'Not found' });
  await b.destroy();
  res.json({ message: 'Deleted' });
});

module.exports = router;
