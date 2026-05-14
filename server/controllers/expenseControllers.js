const expenseModel = require('../models/expenseModel');

module.exports.listExpenses = async (req, res, next) => {
  try {
    const expense = await expenseModel.listByUser(req.session.user_id);
    res.send(expenses);
  } catch (err) {
    next(err);
  }
};

module.exports.createExpense = async (req, res, next) => {
  try {
    const { title, amount, category, date } = req.body;
    if (!title) return res.status(400).send({ error: 'Title is required.' });
    if (!amount) return res.status(400).send({ error: 'Amount is required.' });
    if (!category) return res.status(400).send({ error: 'Category is required.' });
    if (!date) return res.status(400).send({ error: 'Date is required.' });
    const expense = await expenseModel.create({title, amount, category, date}, req.session.user_id);
    res.status(201).send(expense);
  } catch (err) {
    next(err);
  }
};

module.exports.updateExpense = async (req, res, next) => {
  try {
    const { expense_id } = req.params;
    const expense = await expenseModel.find(expense_id);
    if (!expense) return res.status(404).send({ error: 'Expense not found.' });
    if (expense.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }
    const updatedExpense = await expenseModel.update(expense_id, req.body);
    res.send(updatedExpense);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteExpense = async (req, res, next) => {
  try {
    const { expense_id } = req.params;

    // First find the expense to verify ownership
    const expense = await expenseModel.find(expense_id);
    if (!expense) return res.status(404).send({ error: 'Expense not found.' });
    if (expense.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }

    // Destroy the expense only after ownership has been verified
    const destroyedExpense = await expenseModel.destroy(expense_id);
    res.send(destroyedExpense);
  } catch (err) {
    next(err);
  }
};
