import { useState, useEffect } from 'react';
import { fetchAllExpenses } from '../adapters/expense-adapters';
import AddExpenseForm from './AddExpenseForm';
import ExpenseList from './ExpenseList';
import ExpenseChart from './ExpenseChart';

const categories = ['All', 'Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Health'];
const periods = ['All', 'Daily', 'Weekly', 'Monthly', 'Yearly'];

const filterExpensesByPeriod = (expenses, period) => {
  const now = new Date();

  if (period === 'All') return expenses;

  return expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);

    if (period === 'Daily') return expenseDate.toDateString() === now.toDateString();

    if (period === 'Weekly') {
      const startOfWeek = new Date(now);

      startOfWeek.setDate(now.getDate() - now.getDay());

      startOfWeek.setHours(0, 0, 0, 0);

      return expenseDate >= startOfWeek;
    }
    if (period === 'Monthly') {
      return expenseDate.getMonth() === now.getMonth() &&
        expenseDate.getFullYear() === now.getFullYear();
    }

    if (period === 'Yearly') return expenseDate.getFullYear() === now.getFullYear();

    return true;
  });
};

const getTotalAmount = (expenses) => {
  return expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0).toFixed(2);
};

function ExpensePage({ currentUser, handleLogout }) {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPeriod, setSelectedPeriod] = useState('All');

  // This helper fetches expenses on page load with useEffect
  // It is also used within the AddExpenseForm and ExpenseList
  // to re-fetch the expenses when a mutation action is performed
  // such as creating, deleting, or updating a expense.
  const loadExpenses = async () => {
    setIsLoading(true);
    setError(null);
    const { data, error: fetchError } = await fetchAllExpenses();
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setExpenses(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const periodFiltered = filterExpensesByPeriod(expenses, selectedPeriod);

  let filteredExpenses;
  if(selectedCategory === 'All'){
    filteredExpenses = periodFiltered;
  } else {
    filteredExpenses = periodFiltered.filter((e) => e.category === selectedCategory);
  }

  const total = getTotalAmount(filteredExpenses);

  return (
    <section>
      <div id="user-controls">
        <span>Welcome, <strong>{currentUser.username}</strong>!</span>
        <button onClick={handleLogout}>Log Out</button>
      </div>

      <AddExpenseForm loadExpenses={loadExpenses} />

      <div id="period-filter">
        {periods.map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={selectedPeriod === period ? 'filter-btn active' : 'filter-btn'}
          >
            {period}
          </button>
        ))}
      </div>

      <div id="total-banner">
        <span>{selectedPeriod === 'All' ? 'Total spent' : `${selectedPeriod} total`}</span>
        <strong>${total}</strong>
      </div>

      <div id="category-filter">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={selectedCategory === cat ? 'filter-btn active' : 'filter-btn'}
          >
            {cat}
          </button>
        ))}
      </div>
      {isLoading && <p>Loading expenses...</p>}
      {error && <p className="error">Something went wrong: {error}</p>}
      <ExpenseList expenses={filteredExpenses} loadExpenses={loadExpenses} />
      <ExpenseChart expenses={periodFiltered} />
    </section>
  );
}

export default ExpensePage;
