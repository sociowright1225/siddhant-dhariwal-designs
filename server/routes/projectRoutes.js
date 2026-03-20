import { Router } from "express";
import Project from "../models/Projects.js";
import upload from "../middlewares/upload.js";
import protect from "../middlewares/authMiddleware.js";
import cloudinary from "../config/cloudinary.js";

const router = Router();

/* ===========================
   CREATE PROJECT
=========================== */
router.post(
  "/",
  protect,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      // DEBUG: Yahan check karein console mein kya dikh raha hai
      console.log("--- DATA RECEIVED ---");
      console.log("Body:", req.body); 
      console.log("Files:", req.files ? "Found" : "Empty");

      // Validation check
      if (!req.body.title) {
        return res.status(400).json({ message: "Title is required" });
      }

      const mainImage = req.files?.["image"] ? {
        url: req.files["image"][0].path,
        public_id: req.files["image"][0].filename,
      } : null;

      const galleryImages = req.files?.["gallery"] 
        ? req.files["gallery"].map(file => ({
            url: file.path,
            public_id: file.filename,
          }))
        : [];

      const project = await Project.create({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        location: req.body.location || "Not Specified", // Default value for testing
        date: req.body.date ? new Date(req.body.date) : null,
        image: mainImage,
        gallery: galleryImages,
      });

      console.log("Project Created Successfully:", project._id);
      res.status(201).json(project);
    } catch (error) {
      console.error("CRITICAL SAVE ERROR:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

/* ===========================
   UPDATE PROJECT
=========================== */
router.put(
  "/:id",
  protect,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) return res.status(404).json({ message: "Project not found" });

      // Fields update logic
      project.title = req.body.title ?? project.title;
      project.description = req.body.description ?? project.description;
      project.category = req.body.category ?? project.category;
      project.location = req.body.location ?? project.location; // Update logic add kiya
      project.date = req.body.date ?? project.date;             // Update logic add kiya

      // Update Main Image
      if (req.files["image"]) {
        if (project.image?.public_id) {
          await cloudinary.uploader.destroy(project.image.public_id);
        }
        project.image = {
          url: req.files["image"][0].path,
          public_id: req.files["image"][0].filename,
        };
      }

      // Update/Append Gallery
      if (req.files["gallery"]) {
        const newGalleryPhotos = req.files["gallery"].map(file => ({
          url: file.path,
          public_id: file.filename,
        }));
        project.gallery.push(...newGalleryPhotos);
      }

      await project.save();
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// ... Baaki GET aur DELETE routes same rahenge ...
/* ===========================
   GET ALL PROJECTS
=========================== */
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===========================
   GET PROJECT BY ID
=========================== */
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===========================
   DELETE PROJECT
=========================== */
router.delete("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.image?.public_id) {
      await cloudinary.uploader.destroy(project.image.public_id);
    }

    // Gallery images delete karne ke liye (Optional but recommended)
    if (project.gallery.length > 0) {
        for (const photo of project.gallery) {
            await cloudinary.uploader.destroy(photo.public_id);
        }
    }

    await project.deleteOne();
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;