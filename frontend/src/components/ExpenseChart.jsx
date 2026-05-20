import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = {
  Food: '#3B6D11',
  Transport: '#185FA5',
  Entertainment: '#534AB7',
  Utilities: '#BA7517',
  Shopping: '#993556',
  Health: '#993C1D',
};

function ExpenseChart({ expenses }) {
  // Group expenses by category and sum the amounts
  const categoryTotals = expenses.reduce((acc, expense) => {
    const category = expense.category;
    const amount = parseFloat(expense.amount);
    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {});

  const data = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  }));

  if (data.length === 0) return null;

  return (
    <div className="card">
      <h2>Spending by category</h2>
      <PieChart width={400} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={COLORS[entry.name] || '#888'} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `$${value}`} />
        <Legend />
      </PieChart>
    </div>
  );
}

export default ExpenseChart;