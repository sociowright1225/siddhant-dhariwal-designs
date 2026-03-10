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
  upload.single("image"), // multer first
  protect,
  async (req, res) => {
    try {
      const project = await Project.create({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        image: req.file
          ? {
              url: req.file.path,
              public_id: req.file.filename,
            }
          : null,
      });

      res.status(201).json(project);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

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

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===========================
   UPDATE PROJECT
=========================== */
router.put(
  "/:id",
  upload.single("image"),
  protect,
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      project.title = req.body.title ?? project.title;
      project.description = req.body.description ?? project.description;
      project.category = req.body.category ?? project.category;

      if (req.file) {
        // delete old image
        if (project.image?.public_id) {
          await cloudinary.uploader.destroy(project.image.public_id);
        }

        project.image = {
          url: req.file.path,
          public_id: req.file.filename,
        };
      }

      await project.save();

      res.json(project);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

/* ===========================
   DELETE PROJECT
=========================== */
router.delete("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // delete image from cloudinary
    if (project.image?.public_id) {
      await cloudinary.uploader.destroy(project.image.public_id);
    }

    await project.deleteOne();

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;