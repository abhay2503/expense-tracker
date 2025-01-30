export const fetchBudgets = async (id) => {
  try {
    const response = await fetch(`/api/fetchBudgets/${id}`, {
      cache: "no-store",
    });

    const data = await response.json();

    if (response.ok) {
      return data; // { success, budgets, expenses }
    }
    return { error: "Failed to Fetch" };
  } catch (err) {
    console.error("Error in fetchBudgets:", err);
    return { error: "Failed to Fetch" };
  }
};

export const fetchEachBudget = async (id, budgetid) => {
  try {
    const response = await fetch(`/api/fetchEachBudget`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, budgetid }),
    });
    console.log(response);

    const data = await response.json();
    if (response.ok) {
      return data; // { success, budgets, expenses }
    }
    return { error: "Failed to Fetch" };
  } catch (err) {
    console.error(err);

    return { error: "Failed to Fetch" };
  }
};

export const fetchExpenses = async (id) => {
  try {
    const response = await fetch(`/api/fetchExpenses/${id}`, {
      cache: "no-store",
    });

    const data = await response.json();

    if (response.ok) {
      return data; // { success, budgets, expenses }
    }
    return { error: "Failed to Fetch" };
  } catch (err) {
    console.error("Error in fetchExpenses:", err);
    return { error: "Failed to Fetch" };
  }
};
