import connectmongoDB from "@/lib/dbConnect";
import { User } from "@/lib/models";

export async function POST(req) {
  const { id, name, amount, emojiIcon } = await req.json();
  try {
    connectmongoDB();
    const budget = {
      id: Date.now(),
      name,
      amount,
      emojiIcon,
    };

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $push: { budgets: budget } },
      { new: true, projection: { _id: 1 } } // Return only the _id field
    );

    if (!updatedUser) {
      return Response.json({ error: "Data Not Added" }, { status: 401 });
    }
    return Response.json({ success: "Data Added" }, { status: 201 });
  } catch (err) {
    return Response.json({ error: err }, { status: 401 });
  }
}
