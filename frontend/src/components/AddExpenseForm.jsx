import { createExpense } from '../adapters/expense-adapters';

function AddExpenseForm({ loadExpenses }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.elements.title.value;
    const amount = form.elements.amount.value;
    const category = form.elements.category.value;
    const date = form.elements.date.value;
    if (!title || !amount || !category || !date) return;

    const { error } = await createExpense({ title, ammount, category, date });
    if (error) return console.error(error);

    await loadExpenses();
    form.reset();
  };

  return (
    <form id="add-expense-form" onSubmit={handleSubmit}>
      <input type="text" name='title' placeholder='What did I spend in?'/>
      <input type="text" name="amount" placeholder="How much did I spend?" step="0.01" min="0"/>
      <select name="category" id="category-list">
        <option value="">Select a category</option>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Utilities">Utilities</option>
        <option value="Shopping">Shopping</option>
        <option value="Health">Health</option>
      </select>
      <input type="date" name='date'/>
      <button type="submit">Add Expense</button>
    </form>
  );
}

export default AddExpenseForm;
