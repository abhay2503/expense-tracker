import connectmongoDB from "@/lib/dbConnect";
import { User } from "@/lib/models";

export async function POST(req, res) {
  const { id } = await req.json();
  console.log(id);

  try {
    connectmongoDB();
    const user = await User.findOne({ _id: id }).select("budgets expenses");
    // console.log(user);

    const { budgets, expenses } = user;

    return Response.json(
      {
        success: "Budget Fetched Successfully",
        budgets,
        expenses,
      },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return Response.json({ error: "Failed to Fetch" }, { status: 401 });
  }
}
