import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";
import dotenv from "dotenv"

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";

const app = express();

dotenv.config() 
app.use(cors());
app.use(json());

connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(console.error);
 
app.use("/api/auth", authRoutes);  
app.use("/api/products", productRoutes); 
app.get("/test", (req, res)=>{
  res.send("hello world") 
})

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`),
);
