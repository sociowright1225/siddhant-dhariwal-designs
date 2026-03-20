import { Router } from "express";
import Project from "../models/Projects.js";
import upload from "../middlewares/upload.js";
import protect from "../middlewares/authMiddleware.js";
import cloudinary from "../config/cloudinary.js";

const router = Router();

/**
 * CREATE PROJECT
 * Handles Single Cover Image and Multiple Gallery Images/Videos
 */
router.post("/", protect, upload.fields([
  { name: "image", maxCount: 1 },
  { name: "gallery", maxCount: 15 },
]), async (req, res) => {
  try {
    const mainImage = req.files?.["image"] ? {
      url: req.files["image"][0].path,
      public_id: req.files["image"][0].filename,
    } : null;

    const galleryFiles = req.files?.["gallery"] 
      ? req.files["gallery"].map(file => ({
          url: file.path,
          public_id: file.filename,
        }))
      : [];

    const project = await Project.create({
      ...req.body, // spread title, description, category, location, date
      image: mainImage,
      gallery: galleryFiles,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * UPDATE PROJECT
 * Replaces cover image if new one provided; Appends to gallery if new files provided
 */
router.put("/:id", protect, upload.fields([
  { name: "image", maxCount: 1 },
  { name: "gallery", maxCount: 15 },
]), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Update basic fields
    const fieldsToUpdate = ["title", "description", "category", "location", "date"];
    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) project[field] = req.body[field];
    });

    // Update Cover Image
    if (req.files && req.files["image"]) {
      // Delete old cover from Cloudinary
      if (project.image?.public_id) {
        await cloudinary.uploader.destroy(project.image.public_id);
      }
      project.image = {
        url: req.files["image"][0].path,
        public_id: req.files["image"][0].filename,
      };
    }

    // Append New Gallery Items
    if (req.files && req.files["gallery"]) {
      const newFiles = req.files["gallery"].map(file => ({
        url: file.path,
        public_id: file.filename,
      }));
      project.gallery.push(...newFiles);
    }

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * DELETE PROJECT
 * Full cleanup from Cloudinary
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // 1. Delete Main Image
    if (project.image?.public_id) {
      await cloudinary.uploader.destroy(project.image.public_id);
    }

    // 2. Delete Gallery Items (Loop handles images & videos automatically)
    if (project.gallery?.length > 0) {
      const deletePromises = project.gallery.map(file => 
        cloudinary.uploader.destroy(file.public_id, { resource_type: file.url.match(/\.(mp4|webm|mov)$/) ? 'video' : 'image' })
      );
      await Promise.all(deletePromises);
    }

    await project.deleteOne();
    res.json({ message: "Project and associated media deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET routes remain standard...
router.get("/", async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json(projects);
});

export default router;
