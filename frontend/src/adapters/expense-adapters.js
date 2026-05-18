const handleFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Fetch failed. ${response.status} ${response.statusText}`);
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const fetchAllExpenses = async () => {
  return handleFetch('/api/expenses');
};

export const createExpense = async ({ title, amount, category, date }) => {
  return handleFetch('/api/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, amount, category, date }),
  });
};

export const updateExpense = async (expense_id, updates) => {
  return handleFetch(`/api/expenses/${expense_id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
};

export const deleteExpense = async (expense_id) => {
  return handleFetch(`/api/expenses/${expense_id}`, { method: 'DELETE' });
};
