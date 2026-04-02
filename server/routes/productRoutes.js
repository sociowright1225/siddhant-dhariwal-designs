import { Router } from "express";
import { Product, Category } from "../models/Product.js";
import upload from "../middlewares/upload.js";
import protect from "../middlewares/authMiddleware.js";
import cloudinary from "../config/cloudinary.js";

const router = Router();

/* ===========================
    CATEGORY ROUTES
=========================== */

// 1. CREATE CATEGORY (With Duplicate Slug Fix)
router.post("/categories", protect, upload.single("thumbnail"), async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: "Category name is required" });

        const file = req.file;
        
        // Slug generation logic
        let baseSlug = name.toLowerCase().trim().split(' ').join('-');
        
        // Check if slug already exists
        const existingCategory = await Category.findOne({ slug: baseSlug });
        let finalSlug = baseSlug;
        
        if (existingCategory) {
            // Agar pehle se hai, toh timestamp add karke unique banayein
            finalSlug = `${baseSlug}-${Date.now()}`;
        }

        const category = await Category.create({
            name: name.trim(),
            slug: finalSlug,
            thumbnail: file ? { url: file.path, public_id: file.filename } : null
        });

        res.status(201).json(category);
    } catch (error) {
        console.error("Category Error:", error);
        if (error.code === 11000) {
            return res.status(400).json({ message: "A category with this slug already exists." });
        }
        res.status(500).json({ message: error.message });
    }
});

// 4. UPDATE CATEGORY
router.put("/categories/:id", protect, upload.single("thumbnail"), async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: "Category not found" });

        if (req.body.name) {
            category.name = req.body.name.trim();
            // Slug update logic (Optional: Usually slugs shouldn't change for SEO, but here it is)
            category.slug = req.body.name.toLowerCase().trim().split(' ').join('-');
        }

        if (req.file) {
            // Delete old thumbnail from Cloudinary
            if (category.thumbnail?.public_id) {
                await cloudinary.uploader.destroy(category.thumbnail.public_id);
            }
            // Add new thumbnail
            category.thumbnail = { url: req.file.path, public_id: req.file.filename };
        }

        await category.save();
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 5. DELETE CATEGORY
router.delete("/categories/:id", protect, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: "Category not found" });

        // Cloudinary se image delete karein
        if (category.thumbnail?.public_id) {
            await cloudinary.uploader.destroy(category.thumbnail.public_id);
        }

        await category.deleteOne();
        res.json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. GET ALL CATEGORIES
router.get("/categories", async (req, res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3. GET PRODUCTS BY CATEGORY
router.get("/category/:categoryName", async (req, res) => {
    try {
        const { categoryName } = req.params;
        // status published filter
        const products = await Product.find({ category: categoryName, status: "published" }).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/* ===========================
    PRODUCT ROUTES
=========================== */

// 1. GET SINGLE PRODUCT BY SLUG
router.get("/single/:slug", async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug });
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. CREATE PRODUCT
router.post("/", protect, upload.fields([{ name: "mainImage", maxCount: 1 }, { name: "gallery", maxCount: 10 }]), async (req, res) => {
    try {
        const { title, description, price, category, status } = req.body;
        const mainImageFile = req.files['mainImage'] ? req.files['mainImage'][0] : null;
        const galleryFiles = req.files['gallery'] || [];

        // Unique slug for product
        let productSlug = title.toLowerCase().trim().split(' ').join('-');
        const existingProd = await Product.findOne({ slug: productSlug });
        if (existingProd) productSlug = `${productSlug}-${Date.now()}`;

        const product = await Product.create({
            title: title.trim(),
            slug: productSlug,
            description,
            price,
            category,
            status: status || "published",
            mainImage: mainImageFile ? { url: mainImageFile.path, public_id: mainImageFile.filename } : null,
            gallery: galleryFiles.map(file => ({ url: file.path, public_id: file.filename }))
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3. READ ALL PRODUCTS
router.get("/", async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 4. UPDATE PRODUCT
router.put("/:id", protect, upload.fields([{ name: "mainImage", maxCount: 1 }, { name: "gallery", maxCount: 10 }]), async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        if (req.body.title) {
            product.title = req.body.title;
            product.slug = req.body.title.toLowerCase().trim().split(' ').join('-');
        }
        
        product.description = req.body.description || product.description;
        product.price = req.body.price || product.price;
        product.category = req.body.category || product.category;
        product.status = req.body.status || product.status;

        if (req.files && req.files['mainImage']) {
            // Delete old image from Cloudinary if exists
            if (product.mainImage?.public_id) await cloudinary.uploader.destroy(product.mainImage.public_id);
            const newMain = req.files['mainImage'][0];
            product.mainImage = { url: newMain.path, public_id: newMain.filename };
        }

        if (req.files && req.files['gallery']) {
            const newGallery = req.files['gallery'].map(file => ({ url: file.path, public_id: file.filename }));
            product.gallery = [...product.gallery, ...newGallery];
        }

        await product.save();
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 5. DELETE PRODUCT
router.delete("/:id", protect, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Cloudinary cleanup
        if (product.mainImage?.public_id) await cloudinary.uploader.destroy(product.mainImage.public_id);
        if (product.gallery?.length > 0) {
            for (let img of product.gallery) {
                if(img.public_id) await cloudinary.uploader.destroy(img.public_id);
            }
        }

        await product.deleteOne();
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;