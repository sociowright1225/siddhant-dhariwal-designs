import { Router } from "express";
import Product from "../models/Product.js";
import upload from "../middlewares/upload.js";
import protect from "../middlewares/authMiddleware.js";
import cloudinary from "../config/cloudinary.js";

const router = Router();

/* ===========================
   1. CREATE PRODUCT 
   (Isse POST request handle hogi)
=========================== */
router.post(
  "/",
  protect,
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "gallery", maxCount: 10 }
  ]),
  async (req, res) => {
    try {
      const { title, description, price, category, status } = req.body;
      
      const mainImageFile = req.files['mainImage'] ? req.files['mainImage'][0] : null;
      const galleryFiles = req.files['gallery'] || [];

      const product = await Product.create({
        title,
        slug: title.toLowerCase().split(' ').join('-'),
        description,
        price,
        category,
        status,
        mainImage: mainImageFile ? {
          url: mainImageFile.path,
          public_id: mainImageFile.filename,
        } : null,
        gallery: galleryFiles.map(file => ({
          url: file.path,
          public_id: file.filename,
        }))
      });

      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/* ===========================
   2. READ ALL PRODUCTS
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
   3. UPDATE PRODUCT (Sahi Wala)
=========================== */
router.put(
  "/:id",
  protect,
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "gallery", maxCount: 10 }
  ]),
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: "Product not found" });

      // Text Fields Update
      if (req.body.title) {
        product.title = req.body.title;
        product.slug = req.body.title.toLowerCase().split(' ').join('-');
      }
      product.description = req.body.description || product.description;
      product.price = req.body.price || product.price;
      product.category = req.body.category || product.category;
      product.status = req.body.status || product.status;

      // Update Main Image
      if (req.files && req.files['mainImage']) {
        if (product.mainImage?.public_id) {
          await cloudinary.uploader.destroy(product.mainImage.public_id);
        }
        const newMain = req.files['mainImage'][0];
        product.mainImage = { url: newMain.path, public_id: newMain.filename };
      }

      // Add to Gallery
      if (req.files && req.files['gallery']) {
        const newGallery = req.files['gallery'].map(file => ({
          url: file.path,
          public_id: file.filename
        }));
        product.gallery = [...product.gallery, ...newGallery];
      }

      await product.save();
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/* ===========================
   4. DELETE PRODUCT
=========================== */
router.delete("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Cloudinary se photos delete karein
    if (product.mainImage?.public_id) {
      await cloudinary.uploader.destroy(product.mainImage.public_id);
    }
    if (product.gallery?.length > 0) {
      for (let img of product.gallery) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;