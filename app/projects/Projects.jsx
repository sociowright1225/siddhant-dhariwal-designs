"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("https://siddhant-dhariwal-designs-e6u4.vercel.app/api/projects");
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Category ko URL friendly banane ke liye
  const createSlug = (text) => {
    return text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
  };

  if (loading) return <div className="text-center py-24 text-gray-500">Loading Projects...</div>;

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 space-y-32">
      {projects.map((project, index) => {
        const categorySlug = createSlug(project.category);
        const isReverse = index % 2 !== 0;

        return (
          <div key={project._id} className="grid lg:grid-cols-2 gap-16 items-center">
            <div className={`${isReverse ? "lg:order-2" : "lg:order-1"}`}>
              <span className="text-sm text-gray-400 uppercase tracking-widest">{project.category}</span>
              <h2 className="text-3xl md:text-4xl font-semibold mt-3">{project.title}</h2>
              <p className="text-gray-600 mt-4">{project.description}</p>
              
              {/* Sirf Category Slug wala Link */}
              <Link 
                href={`/projects/${categorySlug}`} 
                className="mt-6 inline-flex items-center gap-2 border border-black rounded-full px-6 py-2 text-sm hover:bg-black hover:text-white transition"
              >
                View {project.category} Category
              </Link>
            </div>

            <div className={`${isReverse ? "lg:order-1" : "lg:order-2"}`}>
              <Link href={`/projects/${categorySlug}`}>
                <Image
                  src={project.image.url}
                  alt={project.title}
                  width={800}
                  height={500}
                  className="rounded-xl object-cover w-full h-[400px]"
                />
              </Link>
            </div>
          </div>
        );
      })}
    </section>
  );
}