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

  const createSlug = (text) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  if (loading) return <div className="text-center py-24 text-gray-500 tracking-widest uppercase">Loading Projects...</div>;

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="grid md:grid-cols-3 gap-6">
        {projects.map((project) => {
          const projectSlug = createSlug(project.title);

          return (
            <div key={project._id} className="group">
              <Link href={`/projects/${projectSlug}`}>
                {/* Image Container */}
                <div className="overflow-hidden rounded-2xl shadow-lg bg-gray-100">
                  <Image
                    src={project.image.url}
                    alt={project.title}
                    width={800}
                    height={600}
                    className="object-cover w-full aspect-[4/5] group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                </div>
                
                {/* Title Only */}
                <h2 className="text-base font-bold mt-4 uppercase tracking-tight group-hover:text-gray-600 transition-colors">
                  {project.title}
                </h2>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
