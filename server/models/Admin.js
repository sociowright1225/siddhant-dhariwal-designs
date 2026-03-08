import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Serverless ke liye - model ko cache karta hai
const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default Admin; 