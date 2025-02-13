import connectmongoDB from "@/lib/dbConnect";
import { User } from "@/lib/models";

export async function POST(req) {
  const { name, amount, budgetId, id } = await req.json();
  console.log(budgetId);

  try {
    connectmongoDB();

    const expense = {
      id: Date.now().toString(), // Ensure the id is a string
      amount,
      expensename: name, // Match the schema's field name
      budgetId, // Use `billId` as per your schema
      createdAt: new Date(), // Explicitly set createdAt
    };

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $push: { expenses: expense } }, // Push the correctly structured expense
      { new: true, projection: { _id: 1 } } // Return only the _id field
    );

    if (!updatedUser) {
      return Response.json({ error: "Data Not Added" }, { status: 401 });
    }

    return Response.json({ success: "Data Added" }, { status: 201 });
  } catch (err) {
    console.error("Error adding expense:", err); // Log the actual error
    return Response.json({ error: "Failed to add expense" }, { status: 401 });
  }
}
