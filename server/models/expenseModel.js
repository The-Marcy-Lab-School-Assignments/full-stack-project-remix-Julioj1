const pool = require('../db/pool');

// Returns all expenses for a specific user, ordered by creation time
module.exports.listByUser = async (user_id) => {
  const query = 'SELECT * FROM expenses WHERE user_id = $1 ORDER BY expense_id ASC';
  const { rows } = await pool.query(query, [user_id]);
  return rows;
};

// Returns a single expense row (used for ownership checks before update/delete)
module.exports.find = async (expense_id) => {
  const query = 'SELECT * FROM expenses WHERE expense_id = $1';
  const { rows } = await pool.query(query, [expense_id]);
  return rows[0] || null;
};

// Creates a new expense. Returns the full expense row.
module.exports.create = async (expense, user_id) => {
  const query = 'INSERT INTO expenses (title, amount, category, date, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *';
  const { rows } = await pool.query(query, [expense.title, expense.amount, expense.category, expense.date, user_id]);
  return rows[0];
};

// Updates an existing expense (update title, amount, category, or date). Returns the updated row.
module.exports.update = async (expense_id, { title, amount, category, date }) => {
  const query = 'UPDATE expenses SET title = $1, amount = $2, category = $3, date = $4 WHERE expense_id = $5 RETURNING *';
  const { rows } = await pool.query(query, [title, amount, category, date, expense_id]);
  return rows[0];
};

// Deletes a todo by id
module.exports.destroy = async (expense_id) => {
  const query = 'DELETE FROM expenses WHERE expense_id = $1 RETURNING *';
  const { rows } = await pool.query(query, [expense_id]);
  return rows[0] || null;
};
