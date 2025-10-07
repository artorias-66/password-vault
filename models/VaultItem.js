import mongoose from "mongoose";

const vaultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  username: String,
  password: String, // encrypted string
  url: String,
  notes: String,
}, { timestamps: true });

export default mongoose.models.VaultItem || mongoose.model("VaultItem", vaultSchema);


