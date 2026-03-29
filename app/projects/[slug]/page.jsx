"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { MapPin, Calendar } from "lucide-react"; // Icons for extra polish

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const createSlug = (text) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Function to format date beautifully
  const formatDate = (dateString) => {
    if (!dateString) return "In Progress";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await fetch("https://siddhant-dhariwal-designs-e6u4.vercel.app/api/projects");
        const data = await response.json();
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

  if (loading) return <div className="text-center py-24 text-gray-400 tracking-widest uppercase animate-pulse">Loading Details...</div>;
  if (!project) return <div className="text-center py-24 text-red-500 font-bold uppercase tracking-widest">Project Not Found</div>;

  return (
    <main className="bg-[#F8F8F4] min-h-screen pb-24">
      {/* 1. Header & Breadcrumb */}
      <header className="max-w-7xl mx-auto px-6 pt-32">
        <nav className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-8">
          Home / Projects / <span className="text-gray-900">{project.title}</span>
        </nav>
        
        <h1 className="text-5xl md:text-8xl font-bold uppercase tracking-tighter mb-12 leading-[0.9]">
          {project.title} 
        </h1>

        {/* 2. Big Banner Image */}
        <div className="relative w-full aspect-[16/9] md:aspect-[21/8] rounded-3xl overflow-hidden shadow-2xl mb-16 bg-white">
          <Image
            src={project.image.url}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* 3. Project Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
          <div className="md:col-span-8">
            {/* Description */}
            <p className="text-gray-600 leading-relaxed text-xl md:text-2xl mb-12 font-light">
              {project.description || `${project.title} redefines luxury in the 21st century. By offering high-end aesthetics and conscious consumerism, this project empowers the modern individual.`}
            </p>

            {/* --- NEW: Date & Location Section --- */}
            <div className="flex flex-wrap gap-10 pt-8 border-t border-gray-200">
              {project.location && (
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Location</span>
                  <div className="flex items-center gap-2 text-gray-900 font-medium">
                    <MapPin size={16} className="text-[#6B7F60]" />
                    <span>{project.location}</span>
                  </div>
                </div>
              )}

              {project.date && (
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Completion</span>
                  <div className="flex items-center gap-2 text-gray-900 font-medium">
                    <Calendar size={16} className="text-[#6B7F60]" />
                    <span>{formatDate(project.date)}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Category</span>
                <span className="text-gray-900 font-medium">{project.category}</span>
              </div>
            </div>
            {/* --- End New Section --- */}
          </div>
        </div>

        {/* 4. Reels/Gallery Grid */}
        <h3 className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-8 font-bold">Project Gallery</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Image in Gallery */}
          {/* <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-md group">
            <Image 
              src={project.image.url} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-1000" 
              alt="Hero View" 
            />
          </div> */}
          
          {/* Gallery Images */}
         {project?.gallery?.map((item, idx) => (
  <div key={item.id || idx} className=" overflow-hidden group">
    <Image
      src={item.url}
      width={item.width || 800} // Replace with original width
      height={item.height || 600} // Replace with original height
      alt={`Perspective ${idx + 1}`}
      className="w-auto h-auto group-hover:scale-105 rounded-2xl transition-transform duration-1000"
    />
  </div>
))}
        </div>
      </header>
    </main>
  );
}
