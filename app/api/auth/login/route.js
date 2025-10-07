import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });

    const token = signToken({ userId: user._id, email: user.email });

    return new Response(JSON.stringify({ token }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Login failed" }), { status: 500 });
  }
}
