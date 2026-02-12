import { Router } from "express";
import Product from "../models/Product.js";
import upload from "../middlewares/upload.js";
import protect from "../middlewares/authMiddleware.js";
import slugify from "../utils/slugify.js";
import cloudinary from "../config/cloudinary.js";

const router = Router();

/* ===========================
   CREATE PRODUCT
=========================== */
router.post(
  "/",
  upload.single("image"), // ✅ multer FIRST
  protect,                // ✅ auth AFTER
  async (req, res) => {
    try {
      console.log("FILE:", req.file); // debug

      const product = await Product.create({
        title: req.body.title,
        slug: slugify(req.body.title),
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        status: req.body.status,
        image: req.file
          ? {
              url: req.file.path,
              public_id: req.file.filename,
            }
          : null,
      });

      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/* ===========================
   READ ALL PRODUCTS
=========================== */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===========================
   READ PRODUCT BY SLUG
=========================== */
router.get("/slug/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("category");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===========================
   UPDATE PRODUCT
=========================== */
router.put(
  "/:id",
  upload.single("image"), // ✅ multer FIRST
  protect,
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (req.body.title) {
        product.title = req.body.title;
        product.slug = slugify(req.body.title);
      }

      product.description = req.body.description ?? product.description;
      product.price = req.body.price ?? product.price;
      product.category = req.body.category ?? product.category;
      product.status = req.body.status ?? product.status;

      if (req.file) {
        // delete old image
        if (product.image?.public_id) {
          await cloudinary.uploader.destroy(product.image.public_id);
        }

        product.image = {
          url: req.file.path,
          public_id: req.file.filename,
        };
      }

      await product.save();
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/* ===========================
   DELETE PRODUCT
=========================== */
router.delete("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.image?.public_id) {
      await cloudinary.uploader.destroy(product.image.public_id);
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
