import { updateExpense, deleteExpense} from '../adapters/expense-adapters';

function ExpenseItem({ expense, loadExpenses }) {
  const handleDelete = async () => {
    const { error } = await deleteExpense(expense.expense_id);
    if (error) return console.error(error);
    loadExpenses();
  };

  return (
    <li>
      <span>{expense.title}</span>
      <span>{expense.amount}</span>
      <span>{expense.category}</span>
      <span>{expense.date}</span>
      <button className="delete-btn" onClick={handleDelete}>Delete</button>
    </li>
  );
}

export default ExpenseItem;
