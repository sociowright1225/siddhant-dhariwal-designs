import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    // Naye fields yahan add kiye gaye hain:
    location: { type: String }, 
    date: { type: Date }, 
    image: {
      url: String,
      public_id: String,
    },
    gallery: [
      {
        url: String,
        public_id: String,
      },
    ],
  },
  {
    // Yeh automatically 'createdAt' aur 'updatedAt' fields add kar deta hai
    timestamps: true, 
  },
);

const Project =
  mongoose.models.Projectsd1 || mongoose.model("Projectsd1", ProjectSchema);

export default Project;