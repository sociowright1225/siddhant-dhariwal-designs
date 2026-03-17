"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function CategoryProjects() {
  const { slug } = useParams(); // URL se category slug nikalne ke liye
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("https://siddhant-dhariwal-designs-e6u4.vercel.app/api/projects");
        const data = await response.json();
        
        // Slug se match karne ke liye helper function
        const createSlug = (text) => text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");

        // Filter logic: Sirf wahi projects dikhao jinka category slug matches the URL slug
        const filtered = data.filter(p => createSlug(p.category) === slug);
        setProjects(filtered);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [slug]);

  if (loading) return <div className="text-center py-24 text-gray-500">Loading {slug} Projects...</div>;
  if (projects.length === 0) return <div className="text-center py-24 text-gray-500">No projects found in this category.</div>;

  return (
    <main className="max-w-7xl mx-auto px-6 py-24">
      <Link href="/projects" className="text-sm text-gray-500 hover:underline">← All Categories</Link>
      
      <h1 className="text-4xl font-bold mt-6 capitalize mb-12">
        {slug.replace(/-/g, " ")} Projects
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div key={project._id} className="group border border-gray-400 rounded-2xl overflow-hidden p-4 bg-white shadow-sm">
            <div className="relative h-64 w-full overflow-hidden rounded-xl">
              <Image 
                src={project.image.url} 
                alt={project.title} 
                fill
                className="object-cover group-hover:scale-110 transition duration-500"
              />
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-semibold">{project.title}</h3>
              <p className="text-gray-500 text-sm mt-2 line-clamp-2">{project.description}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}