const express = require('express');
const {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary
} = require('../controllers/transactionController');

const router = express.Router();

router
  .route('/')
  .get(getTransactions)
  .post(createTransaction);

router
  .route('/:id')
  .get(getTransaction)
  .put(updateTransaction)
  .delete(deleteTransaction);

router
  .route('/summary')
  .get(getSummary);

module.exports = router;