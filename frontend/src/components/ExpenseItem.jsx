import { deleteExpense } from '../adapters/expense-adapters';

function ExpenseItem({ expense, loadExpenses }) {
  const badgeClass = `badge badge-${expense.category.toLowerCase()}`;

  const handleDelete = async () => {
    const { error } = await deleteExpense(expense.expense_id);
    if (error) return console.error(error);
    loadExpenses();
  };

  return (
    <li className="expense-item">
      <span className="expense-title">{expense.title}</span>
      <span className="expense-amount">${expense.amount}</span>
      <span className={badgeClass}>{expense.category}</span>
      <span className="expense-date">{expense.date}</span>
      <button className="btn-delete" onClick={handleDelete}>Delete</button>
    </li>
  );
}

export default ExpenseItem;