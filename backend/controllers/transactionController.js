const Transaction = require('../models/Transaction');

// Get all transactions
exports.getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    next(error);
  }
};

// Get single transaction
exports.getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

// Create transaction
exports.createTransaction = async (req, res, next) => {
  try {
    const { description, amount, type } = req.body;

    // Validation
    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Description is required'
      });
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid positive amount is required'
      });
    }

    if (!type || !['income', 'expense'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Type must be either income or expense'
      });
    }

    const transaction = await Transaction.create({
      description: description.trim(),
      amount: parseFloat(amount),
      type
    });

    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

// Update transaction
exports.updateTransaction = async (req, res, next) => {
  try {
    const { description, amount, type } = req.body;

    // Validation
    if (description !== undefined && (!description || !description.trim())) {
      return res.status(400).json({
        success: false,
        error: 'Description cannot be empty'
      });
    }

    if (amount !== undefined && (isNaN(amount) || amount <= 0)) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be a positive number'
      });
    }

    if (type !== undefined && !['income', 'expense'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Type must be either income or expense'
      });
    }

    const updateData = {};
    if (description !== undefined) updateData.description = description.trim();
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (type !== undefined) updateData.type = type;

    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

// Delete transaction
exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// Get summary
exports.getSummary = async (req, res, next) => {
  try {
    const transactions = await Transaction.find();

    const income = transactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const expenses = transactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const balance = income - expenses;

    res.status(200).json({
      success: true,
      data: {
        income,
        expenses,
        balance
      }
    });
  } catch (error) {
    next(error);
  }
};