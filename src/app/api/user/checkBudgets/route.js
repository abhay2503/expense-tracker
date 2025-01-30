import connectmongoDB from "@/lib/dbConnect";
import { User } from "@/lib/models";

export async function POST(req, res) {
  try {
    const { id } = await req.json(); // Get user ID from the query params

    if (!id) {
      return Response.json({ error: "User ID is required" }, { status: 401 });
    }

    connectmongoDB();
    const user = await User.findOne({ _id: id }).select("budgets");
    console.log(user);
    if (!user || user.budgets.length == 0) {
      return Response.json({ error: "No Data" }, { status: 401 });
    }

    return Response.json(
      {
        success: "Budget Fetched Successfully",
      },
      { status: 201 }
    );
  } catch (err) {
    console.log(err);
    return Response.json({ error: "Failed to Fetch" }, { status: 401 });
  }
}
