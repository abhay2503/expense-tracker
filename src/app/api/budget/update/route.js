import connectmongoDB from "@/lib/dbConnect";
import { User } from "@/lib/models";

export async function POST(req) {
  const { name, amount, emojiIcon, id, budgetId } = await req.json();

  console.log(
    name + " " + amount + " " + emojiIcon + " " + id + " " + budgetId
  );

  try {
    connectmongoDB();
    const updatedUser = await User.findOneAndUpdate(
      { _id: id, "budgets.id": budgetId }, // Match the user by `id` and budget by `budgetId`
      {
        $set: {
          "budgets.$.name": name,
          "budgets.$.amount": amount,
          "budgets.$.emojiIcon": emojiIcon,
        },
      },
      { new: true, projection: { budgets: 1 } } // Return the updated budgets array
    );

    console.log(updatedUser);

    if (!updatedUser) {
      return Response.json({ error: "Budget not Found" }, { status: 401 });
    }

    return Response.json(
      {
        success: "Budget updated successfully",
      },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);

    return Response.json({ error: err }, { status: 401 });
  }
}
