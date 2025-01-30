import connectmongoDB from "@/lib/dbConnect";
import { User } from "@/lib/models";

export async function DELETE(req, res) {
  const { id, budgetId } = await req.json();

  console.log(id);
  console.log(budgetId);
  try {
    connectmongoDB();
    const budgetResult = await User.updateOne(
      { _id: id }, // Find the user by ID
      { $pull: { budgets: { id: budgetId } } } // Pull the expense with the matching expense ID
    );
    console.log(budgetResult);
    if (budgetResult.modifiedCount === 0) {
      return Response.json({ error: "Data Not Deleted" }, { status: 401 });
    }

    const expenseResult = await User.updateMany(
      { _id: id },
      { $pull: { expenses: { budgetId: budgetId } } } // Remove expenses with the matching budgetId
    );

    if (expenseResult.modifiedCount === 0) {
      return Response.json({ error: "Data Not Deleted" }, { status: 401 });
    }
    return Response.json({ success: "Data Deleted" }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Failed to delete budget" }, { status: 401 });
  }
}
