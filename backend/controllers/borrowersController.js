// backend/controllers/borrowersController.js

const { Borrower, Loan } = require('../models');

//
// GET /borrowers
// Return all borrowers, each with its loans
//
exports.getAllBorrowers = async (req, res) => {
  try {
    const borrowers = await Borrower.findAll({
      include: [
        {
          model: Loan,
          as: 'loans'
        }
      ]
    });
    res.json(borrowers);
  } catch (error) {
    console.error('Error fetching borrowers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//
// GET /borrowers/:id
// Return a single borrower (by PK) with its loans
//
exports.getBorrowerById = async (req, res) => {
  try {
    const borrower = await Borrower.findByPk(req.params.id, {
      include: [{ model: Loan, as: 'loans' }]
    });
    if (!borrower) {
      return res.status(404).json({ message: 'Borrower not found' });
    }
    res.json(borrower);
  } catch (error) {
    console.error('Error fetching borrower:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//
// POST /borrowers
// Create a new borrower
//
exports.createBorrower = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    // Basic validation
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: 'firstName, lastName and email are required' });
    }
    const newBorrower = await Borrower.create({ firstName, lastName, email });
    res.status(201).json(newBorrower);
  } catch (error) {
    console.error('Error creating borrower:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//
// PATCH /borrowers/:id
// Update an existing borrower
//
exports.updateBorrower = async (req, res) => {
  try {
    const borrower = await Borrower.findByPk(req.params.id);
    if (!borrower) {
      return res.status(404).json({ message: 'Borrower not found' });
    }
    const { firstName, lastName, email } = req.body;
    await borrower.update({ firstName, lastName, email });
    res.json(borrower);
  } catch (error) {
    console.error('Error updating borrower:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//
// DELETE /borrowers/:id
// Remove a borrower (and cascade-delete their loans)
//
exports.deleteBorrower = async (req, res) => {
  try {
    const borrower = await Borrower.findByPk(req.params.id);
    if (!borrower) {
      return res.status(404).json({ message: 'Borrower not found' });
    }
    await borrower.destroy();
    res.json({ message: 'Borrower deleted successfully' });
  } catch (error) {
    console.error('Error deleting borrower:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
