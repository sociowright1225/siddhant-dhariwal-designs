import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    image: {
      url: String,
      public_id: String,
    },
  },
  {
    timestamps: true,
  },
);

const Project =
  mongoose.models.Projectsd || mongoose.model("Projectsd", ProjectSchema);

export default Project;
