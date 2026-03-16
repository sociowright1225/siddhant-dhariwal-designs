"use client"; // Remove if using Next.js Server Components
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("https://siddhant-dhariwal-designs-e6u4.vercel.app/api/projects");
        const data = await response.json();
        // Based on your JSON structure, 'data' is the array
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <div className="text-center py-24">Loading Projects...</div>;

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 space-y-32 overflow-hidden">
      {projects.map((project, index) => {
        const isReverse = index % 2 !== 0;

        return (
          <div
            key={project._id} // Using the _id from your MongoDB/API
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            {/* TEXT */}
            <div className={`${isReverse ? "lg:order-2" : "lg:order-1"}`}>
              <span className="text-sm text-gray-400 uppercase tracking-widest">
                {project.category}
              </span>

              <h2 className="text-3xl md:text-4xl font-semibold mt-3">
                {project.title}
              </h2>

              <p className="text-gray-600 mt-4 max-w-md">
                {project.description || "No description available for this project."}
              </p>

              <a href="/contact" className="mt-6 inline-flex items-center gap-2 border border-black rounded-full px-6 py-2 text-sm hover:bg-black hover:text-white transition">
                Explore Our World
              </a>
            </div>

            {/* IMAGES */}
            <div className={`${isReverse ? "lg:order-1" : "lg:order-2"}`}>
              <div className="flex flex-col sm:flex-row gap-4 max-w-full">
                <div className="w-full">
                  <Image
                    src={project.image.url} // Accessing the nested Cloudinary URL
                    alt={project.title}
                    width={800}
                    height={500}
                    className="rounded-xl object-cover w-full h-[400px]" // Fixed height keeps things neat
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}