import connectmongoDB from "@/lib/dbConnect";
import { User } from "@/lib/models";

export async function POST(req) {
  try {
    const { id, budgetid } = await req.json();
    console.log(id);

    if (!id) {
      return res.json({ error: "User ID is required" }, { status: 400 });
    }

    await connectmongoDB(); // Connect to MongoDB
    console.log("id", id);
    console.log("budgetid", budgetid);

    // Fetch the user and match the specific budget
    const user = await User.find(
      {
        _id: id,
        "budgets.id": budgetid, // Match based on the `id` field in budgets array
      },
      { "budgets.$": 1, expenses: 1 } // Project only the matched budget and all expenses
    );

    if (!user || user.length == 0 || user[0].budgets.length === 0) {
      return Response.json({ error: "Budget not found" }, { status: 404 });
    }

    const relatedBudgets = user[0].budgets.filter(
      (budget) => budget.id == budgetid
    );
    const sortedExpenses = user[0].expenses.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt); // Descending order
    });

    return Response.json(
      {
        success: "Data Fetched Successfully",
        budget: relatedBudgets,
        expenses: sortedExpenses,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching budgets:", err);
    return Response.json({ error: "Failed to Fetch" }, { status: 400 });
  }
}
