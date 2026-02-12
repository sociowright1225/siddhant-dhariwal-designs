import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: String,
    price: Number,
    category:{ type: String, required: true },
    image: {
      url: String,
      public_id: String,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  { timestamps: true },
);

export default model("Interiors", productSchema);
