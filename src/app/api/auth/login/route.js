import connectmongoDB from "@/lib/dbConnect";
import { User } from "@/lib/models";
import bcrypt from "bcrypt";

export async function POST(req) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return res.status(401).json({ error: "Plz Fill Data Properly" });
  }
  try {
    connectmongoDB();
    const user = await User.findOne({ email });

    if (!user) {
      return Response.json({ error: "Wrong Credentials" }, { status: 401 });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return Response.json({ error: "Wrong Credentials" }, { status: 401 });
    }

    console.log(user);

    return Response.json(
      { success: "Logged In", _id: user._id, name: user.name },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return Response.json({ error: "Failed to login!" }, { status: 401 });
  }
}
