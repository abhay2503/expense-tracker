import connectmongoDB from "@/lib/dbConnect";
import { User } from "@/lib/models";

export async function DELETE(req, res) {
  const { id, expenseid } = await req.json();

  console.log(id + " " + expenseid);

  try {
    connectmongoDB();

    const result = await User.updateOne(
      { _id: id }, // Find the user by ID
      { $pull: { expenses: { _id: expenseid } } } // Pull the expense with the matching expense ID
    );
    console.log(result);

    if (result.modifiedCount === 0) {
      return Response.json({ error: "Data Not Deleted" }, { status: 401 });
    }

    return Response.json({ success: "Data Deleted" }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: "Failed to delete expense" },
      { status: 401 }
    );
  }
}
