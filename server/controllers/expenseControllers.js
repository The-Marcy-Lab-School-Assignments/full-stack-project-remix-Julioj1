const expenseModel = require('../models/expenseModel');

module.exports.listTodos = async (req, res, next) => {
  try {
    const expense = await expenseModel.listByUser(req.session.user_id);
    res.send(expenses);
  } catch (err) {
    next(err);
  }
};

module.exports.createExpense = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).send({ error: 'Title is required.' });
    const todo = await expenseModel.create(title, req.session.user_id);
    res.status(201).send(expense);
  } catch (err) {
    next(err);
  }
};

module.exports.updateTodo = async (req, res, next) => {
  try {
    const { todo_id } = req.params;
    const todo = await todoModel.find(todo_id);
    if (!todo) return res.status(404).send({ error: 'Todo not found.' });
    if (todo.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }
    const updatedTodo = await todoModel.update(todo_id, req.body);
    res.send(updatedTodo);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteTodo = async (req, res, next) => {
  try {
    const { todo_id } = req.params;

    // First find the todo to verify ownership
    const todo = await todoModel.find(todo_id);
    if (!todo) return res.status(404).send({ error: 'Todo not found.' });
    if (todo.user_id !== req.session.user_id) {
      return res.status(403).send({ error: 'Not authorized.' });
    }

    // Destroy the todo only after ownership has been verified
    const destroyedTodo = await todoModel.destroy(todo_id);
    res.send(destroyedTodo);
  } catch (err) {
    next(err);
  }
};
