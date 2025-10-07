import { connectDB } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import VaultItem from "@/models/VaultItem";

export async function GET(req) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = verifyToken(token);
  if (!user) return new Response("Unauthorized", { status: 401 });

  await connectDB();
  const items = await VaultItem.find({ userId: user.userId });
  return new Response(JSON.stringify(items), { status: 200 });
}

export async function POST(req) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = verifyToken(token);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  await connectDB();

  const item = await VaultItem.create({ ...body, userId: user.userId });
  return new Response(JSON.stringify(item), { status: 201 });
}

export async function PUT(req) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = verifyToken(token);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { id, ...updates } = await req.json();
  if (!id) return new Response("Missing id", { status: 400 });

  await connectDB();

  const item = await VaultItem.findOneAndUpdate(
    { _id: id, userId: user.userId },
    { $set: updates },
    { new: true }
  );

  if (!item) return new Response("Not found", { status: 404 });
  return new Response(JSON.stringify(item), { status: 200 });
}

export async function DELETE(req) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const user = verifyToken(token);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { id } = await req.json();
  await connectDB();
  await VaultItem.findOneAndDelete({ _id: id, userId: user.userId });
  return new Response("Deleted", { status: 200 });
}
