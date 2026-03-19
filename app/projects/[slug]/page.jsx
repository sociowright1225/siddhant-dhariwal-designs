"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Slug banane ka function (Wahi logic jo projects page par hai)
  const createSlug = (text) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await fetch("https://siddhant-dhariwal-designs-e6u4.vercel.app/api/projects");
        const data = await response.json();
        
        // Title se match karke project find karein
        const foundProject = data.find(p => createSlug(p.title) === slug);
        setProject(foundProject);
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectData();
  }, [slug]);

  if (loading) return <div className="text-center py-24 text-gray-400 tracking-widest uppercase">Loading Details...</div>;
  if (!project) return <div className="text-center py-24 text-red-500">Project Not Found</div>;

  return (
    <main className="bg-[#F8F8F4] min-h-screen py-24">
      {/* 1. Header & Breadcrumb */}
      <header className="max-w-7xl mx-auto px-6 pt-12">
        <nav className="text-[10px] text-gray-400 uppercase tracking-widest mb-6">
          Home / Projects / {project.title}
        </nav>
        <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight mb-10">
          {project.title} 
          {/* <span className="text-[#6B7F60] font-medium">{project.category}</span> */}
        </h1>

        {/* 2. Big Banner Image */}
        <div className="relative w-full aspect-[21/9] md:aspect-[25/9] rounded-2xl overflow-hidden shadow-sm mb-10 bg-white flex items-center justify-center p-8">
          <Image
            src={project.image.url}
            alt={project.title}
            fill
            className="object-cover" // Logo type feel ke liye contain use kiya hai
            priority
          />
        </div>

        {/* 3. Project Overview Section (As per Screenshot) */}
        <div className=" gap-8 md:gap-16 mb-24">
         
          
          <div className="md:col-span-6">
            <p className="text-gray-600 leading-relaxed text-lg md:text-xl">
              {project.description || `${project.title} redefines luxury in the 21st century. By offering high-end aesthetics and conscious consumerism, this project empowers the modern individual to choose brilliance without compromise.`}
            </p>
          </div>

       
        </div>

        {/* 4. Reels/Gallery Grid (Screenshot ke niche wale vertical mobile images) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {/* 1. Main Image (Ab ye grid ka pehla item ban jayega) */}
  <div className="relative aspect-square md:aspect-[4/5] rounded-xl overflow-hidden shadow-lg group">
    <Image 
      src={project.image.url} 
      fill 
      className="object-cover group-hover:scale-105 transition-transform duration-700" 
      alt="Main View" 
    />
  </div>
  
  {/* 2. Gallery Images */}
  {project.gallery && project.gallery.map((item, idx) => (
    <div key={idx} className="relative aspect-square md:aspect-[4/5] rounded-xl overflow-hidden shadow-lg group">
      <Image
        src={item.url}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-700"
        alt={`Gallery View ${idx + 1}`}
      />
    </div>
  ))}
</div>
      </header>
    </main>
  );
}