import mongoose from "mongoose";

// --- CATEGORY SCHEMA ---
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, unique: true },
  thumbnail: {
    url: String,
    public_id: String,
  }
}, { timestamps: true });

// --- PRODUCT SCHEMA (Existing) ---
const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: String,
    price: Number,
    category: { type: String, required: true }, // Isme Category ka 'name' store hoga
    mainImage: {
      url: String,
      public_id: String,
    },
    gallery: [
      {
        url: String,
        public_id: String,
      }
    ],
    status: { type: String, enum: ["draft", "published"], default: "draft" },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Productsd1", ProductSchema);
const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);

export { Product, Category };
export default Product;