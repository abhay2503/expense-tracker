import connectmongoDB from "@/lib/dbConnect";
import { User } from "@/lib/models";

export async function GET(req, { params }) {
  try {
    const { id } = params; // Get user ID from the query params

    if (!id) {
      return res.json({ error: "User ID is required" }, { status: 400 });
    }

    console.log(id);

    await connectmongoDB(); // Connect to MongoDB
    const user = await User.findOne({ _id: id }).select("expenses");

    console.log(user);

    // if (!user || user.expenses.length == 0) {
    //   return Response.json({ error: "User not found" }, { status: 400 });
    // }

    const sortedExpenses = user.expenses.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt); // Descending order
    });

    return Response.json(
      {
        success: "Budget Fetched Successfully",
        expenses: sortedExpenses,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching budgets:", err);
    return Response.json({ error: "Failed to Fetch" }, { status: 400 });
  }
}
