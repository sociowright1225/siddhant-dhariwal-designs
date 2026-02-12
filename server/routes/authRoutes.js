import { Router } from "express";
import { hash, compare } from "bcryptjs";
import Admin from "../models/Admin.js";
import generateToken from "../utils/generateToken.js";

const router = Router();

// REGISTER (use once)
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const exists = await Admin.findOne({ email });
  if (exists) return res.status(400).json({ message: "Admin exists" });

  const hashed = await hash(password, 10);
  const admin = await Admin.create({ email, password: hashed });

  res.json({
    email: admin.email,
    token: generateToken(admin._id),
  });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(401).json({ message: "Invalid credentials" });

  const match = await compare(password, admin.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  res.json({
    email: admin.email,
    token: generateToken(admin._id),
  });
});

export default router;
