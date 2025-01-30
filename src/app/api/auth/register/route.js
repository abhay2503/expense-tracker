import connectmongoDB from "@/lib/dbConnect";
import { User } from "@/lib/models";
import bcrypt from "bcrypt";

export async function POST(req) {
  const { name, email, password } = await req.json();

  try {
    await connectmongoDB();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    // revalidatePath("/Login");
    // redirect("/Login");
    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json({ error: "Failed to create user!" }, { status: 401 });
  }
}
