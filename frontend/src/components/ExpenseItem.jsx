import { useState } from 'react';
import { updateExpense, deleteExpense } from '../adapters/expense-adapters';

function ExpenseItem({ expense, loadExpenses }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(expense.title);
  const [amount, setAmount] = useState(expense.amount);
  const [category, setCategory] = useState(expense.category);
  const [date, setDate] = useState(expense.date.slice(0, 10));

  const badgeClass = `badge badge-${expense.category.toLowerCase()}`;

  const handleDelete = async () => {
    const { error } = await deleteExpense(expense.expense_id);
    if (error) return console.error(error);
    loadExpenses();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { error } = await updateExpense(expense.expense_id, { title, amount, category, date });
    if(error) return console.error(error);
    setIsEditing(false);
    loadExpenses();
  }
  if(isEditing){
    return(
    <li className='expense-item' style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} step="0.01" />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Utilities">Utilities</option>
          <option value="Shopping">Shopping</option>
          <option value="Health">Health</option>
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button type='submit'>Save</button>
        <button type='button' onClick={() => setIsEditing(false)}>Cancel</button>
      </form>
    </li>
    );
  }
  return (
    <li className="expense-item">
      <span className="expense-title">{expense.title}</span>
      <span className="expense-amount">${expense.amount}</span>
      <span className={badgeClass}>{expense.category}</span>
      <span className="expense-date">{expense.date.slice(0, 10)}</span>
      <button onClick={() => setIsEditing(true)}>Edit</button>
      <button className="btn-delete" onClick={handleDelete}>Delete</button>
    </li>
  );
}

export default ExpenseItem;