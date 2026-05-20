import { useState, useEffect } from 'react';
import { fetchAllExpenses } from '../adapters/expense-adapters';
import AddExpenseForm from './AddExpenseForm';
import ExpenseList from './ExpenseList';
import ExpenseChart from './ExpenseChart';

const categories = ['All', 'Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Health'];

function ExpensePage({ currentUser, handleLogout }) {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // This helper fetches expenses on page load with useEffect
  // It is also used within the AddExpenseForm and ExpenseList
  // to re-fetch the expenses when a mutation action is performed
  // such as creating, deleting, or updating a todo.
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

  let filteredExpenses;
  if(selectedCategory === 'All'){
    filteredExpenses = expenses;
  } else {
    filteredExpenses = expenses.filter((e) => e.category === selectedCategory);
  }

  return (
    <section>
      <div id="user-controls">
        <span>Welcome, <strong>{currentUser.username}</strong>!</span>
        <button onClick={handleLogout}>Log Out</button>
      </div>
      <AddExpenseForm loadExpenses={loadExpenses} />
      <div id='category-filter'>
        {categories.map((cate) => (
          <button key={cate} onClick={() => setSelectedCategory(cate)}
          className={selectedCategory === cate ? 'filter-btn active' : 'filter-btn'}>
            {cate}
          </button>
        ))}
      </div>
      {isLoading && <p>Loading expenses...</p>}
      {error && <p className="error">Something went wrong: {error}</p>}
      <ExpenseList expenses={filteredExpenses} loadExpenses={loadExpenses} />
      <ExpenseChart expenses={expenses} />
    </section>
  );
}

export default ExpensePage;
