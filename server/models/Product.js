import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: String,
    price: Number,
    category: { type: String, required: true },
    // Yeh Category page ke liye hai
    mainImage: {
      url: String,
      public_id: String,
    },
    // Yeh Detail page ke liye hai
    gallery: [
      {
        url: String,
        public_id: String,
      }
    ],
    status: { type: String, enum: ["draft", "published"], default: "draft" },
}, { timestamps: true });
const Product =
  mongoose.models.Product || mongoose.model("Productsd1", ProductSchema);


export default Product;
