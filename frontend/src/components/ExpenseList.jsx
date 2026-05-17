import ExpenseItem from './ExpenseItem';

function ExpenseList({ expenses, loadExpenses }) {
  return (
    <ul id="expense-list">
      {expenses.map((expense) => (
        <ExpenseItem
          key={expense.expense_id}
          expense={expense}
          loadExpenses={loadExpenses}
        />
      ))}
    </ul>
  );
}

export default ExpenseList;
