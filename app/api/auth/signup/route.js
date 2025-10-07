import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "User already exists" }), { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });

    return new Response(JSON.stringify({ message: "User created", userId: user._id }), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Error creating user" }), { status: 500 });
  }
}