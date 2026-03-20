"use client";

import React, { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import {
  Plus,
  Trash2,
  Edit3,
  Search,
  Image as ImageIcon,
  Loader2,
  Package,
  X,
  Briefcase,
  MapPin,
  Calendar,
  Film, // Video Icon
  FileText,
  Check,
  AlertCircle
} from "lucide-react";

/**
 * ARCHITECT ADMIN DASHBOARD
 * Simple, Professional & Functional
 * Supports Image & Video Gallery for Projects
 */

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");
  const [items, setItems] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const initialForm = {
    _id: null,
    title: "",
    category: "",
    price: "",
    description: "",
    location: "",
    date: "",
    status: "published",
    image: null,
    gallery: [], // Mixed files (Images/Videos)
  };

  const [form, setForm] = useState(initialForm);
  const [preview, setPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  // --- DATA FETCHING ---
  const loadData = async () => {
    try {
      setFetching(true);
      const endpoint = activeTab === "products" ? "/products" : "/projects";
      const { data } = await api.get(endpoint);
      setItems(data);
    } catch (err) {
      console.error("Fetch Error:", err);
      setItems([]);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadData();
    resetForm();
  }, [activeTab]);

  // --- LOGIC ---
  const categories = useMemo(() => {
    const cats = items.map((p) => p.category).filter(Boolean);
    return ["All", ...new Set(cats)];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((p) => {
      const titleMatch = p.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const catMatch = filterCategory === "All" || p.category === filterCategory;
      return titleMatch && catMatch;
    });
  }, [items, searchQuery, filterCategory]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files?.[0]) {
      const file = files[0];
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    } 
    else if (name === "gallery" && files) {
      const fileArray = Array.from(files);
      // New Files add karna (Don't overwrite)
      setForm(prev => ({ ...prev, gallery: [...prev.gallery, ...fileArray] }));
      
      const newPreviews = fileArray.map(file => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith("video") ? "video" : "image"
      }));
      setGalleryPreviews(prev => [...prev, ...newPreviews]);
    } 
    else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleEdit = (item) => {
    const formattedDate = item.date ? new Date(item.date).toISOString().split('T')[0] : "";
    
    setForm({
      _id: item._id,
      title: item.title,
      category: item.category,
      price: item.price || "",
      description: item.description || "",
      location: item.location || "",
      date: formattedDate,
      status: item.status || "published",
      image: null,
      gallery: [],
    });

    setPreview(item.image?.url || null);
    
    if (item.gallery) {
      setGalleryPreviews(item.gallery.map(img => ({
        url: img.url,
        type: img.url.match(/\.(mp4|webm|ogg|mov)$/i) ? "video" : "image"
      })));
    } else {
      setGalleryPreviews([]);
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setPreview(null);
    setGalleryPreviews([]);
  };

  const removeGalleryItem = (index) => {
    setForm(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = activeTab === "products" ? "/products" : "/projects";

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("category", form.category);
      formData.append("description", form.description);
      
      if (activeTab === "products") {
        formData.append("price", form.price);
      } else {
        formData.append("location", form.location);
        formData.append("date", form.date);
      }

      if (form.image instanceof File) {
        formData.append("image", form.image);
      }

      // GALLERY UPLOAD (IMAGES & VIDEOS)
      if (activeTab === "projects") {
        form.gallery.forEach((file) => {
          if (file instanceof File) formData.append("gallery", file);
        });
      }

      if (form._id) {
        await api.put(`${endpoint}/${form._id}`, formData);
      } else {
        await api.post(endpoint, formData);
      }
      
      alert("Saved Successfully!");
      resetForm();
      loadData();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Failed"));
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.delete(`/${activeTab}/${id}`);
      loadData();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-slate-800 antialiased">
      
      {/* SIDEBAR - Clean & Simple */}
      <aside className="w-64 border-r border-slate-100 bg-slate-50/50 flex flex-col fixed h-full overflow-hidden">
        <div className="p-8">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <div className="h-3 w-3 bg-blue-600 rounded-full" /> Dashboard
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <button
            onClick={() => setActiveTab("products")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "products" ? "bg-white border border-slate-200 text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Package size={18} /> Products
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "projects" ? "bg-white border border-slate-200 text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Briefcase size={18} /> Projects
          </button>
        </nav>

        <div className="p-6 border-t border-slate-100">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">System v2.0</div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-12 max-w-[1600px]">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 capitalize leading-tight">Manage {activeTab}</h2>
            <p className="text-slate-500 text-sm mt-1">Total {items.length} items found</p>
          </div>
          
          <div className="flex gap-4">
             <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-12">
          
          {/* LIST VIEW */}
          <div className="flex-1">
            {fetching ? (
              <div className="h-64 flex items-center justify-center text-slate-400">
                <Loader2 size={24} className="animate-spin mr-2" /> Loading...
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map((item) => (
                  <div key={item._id} className="p-4 bg-white border border-slate-100 rounded-xl hover:border-blue-200 transition-all group shadow-sm flex gap-4 items-center">
                    <div className="h-16 w-16 bg-slate-50 rounded-lg overflow-hidden flex-shrink-0 border border-slate-50">
                      {item.image?.url ? <img src={item.image.url} className="h-full w-full object-cover" /> : <ImageIcon className="m-auto mt-4 text-slate-300" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 truncate">{item.title}</h4>
                      <p className="text-xs text-slate-400 font-medium uppercase mt-0.5">{item.category}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit3 size={16} /></button>
                      <button onClick={() => deleteItem(item._id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-2xl text-slate-400">No items found.</div>
            )}
          </div>

          {/* FORM VIEW - Sticky Sidebar Style */}
          <div className="w-full xl:w-[480px]">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm sticky top-12">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  {form._id ? "Edit Details" : "Add New Item"}
                </h3>
                {form._id && <button onClick={resetForm} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>}
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                
                {/* Text Fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Title</label>
                      <input name="title" value={form.title} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-100 p-3 rounded-lg text-sm focus:bg-white focus:border-blue-500 outline-none transition-all" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase">Category</label>
                        <select name="category" value={form.category} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-lg text-sm focus:border-blue-500 outline-none transition-all appearance-none" required>
                          <option value="">Select...</option>
                          <option value="Residential">Residential</option>
                          <option value="Commercial">Commercial</option>
                          <option value="Interior">Interior</option>
                        </select>
                      </div>
                      
                      {activeTab === "products" ? (
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-500 uppercase">Price</label>
                          <input name="price" type="number" value={form.price} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-lg text-sm focus:border-blue-500 outline-none" />
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-500 uppercase">Completion Date</label>
                          <input name="date" type="date" value={form.date} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-lg text-sm focus:border-blue-500 outline-none" />
                        </div>
                      )}
                    </div>
                  </div>

                  {activeTab === "projects" && (
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-slate-300" size={16} />
                        <input name="location" value={form.location} onChange={handleChange} placeholder="City, State" className="w-full bg-slate-50 border border-slate-100 pl-10 pr-4 py-3 rounded-lg text-sm focus:border-blue-500 outline-none" />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full bg-slate-50 border border-slate-100 p-3 rounded-lg text-sm outline-none focus:border-blue-500" />
                  </div>
                </div>

                {/* Main Image Upload */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Cover Image</label>
                  <div className="border-2 border-dashed border-slate-100 rounded-xl p-4 bg-slate-50/50 hover:bg-white transition-all relative">
                    {preview ? (
                      <div className="flex items-center gap-4">
                        <img src={preview} className="h-16 w-16 object-cover rounded-lg border border-white shadow-sm" />
                        <span className="text-xs text-blue-600 font-medium">Image Loaded</span>
                        <button type="button" onClick={() => {setPreview(null); setForm({...form, image: null})}} className="ml-auto p-1 text-red-400 hover:text-red-600"><X size={16}/></button>
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        <Plus className="mx-auto text-slate-300 mb-1" size={18} />
                        <span className="text-[10px] text-slate-400 font-bold uppercase">Upload Cover</span>
                      </div>
                    )}
                    <input type="file" name="image" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleChange} />
                  </div>
                </div>

                {/* PROJECT GALLERY (IMAGES & VIDEOS) */}
                {activeTab === "projects" && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Gallery (Images/Videos)</label>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">{galleryPreviews.length} items</span>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2">
                      {galleryPreviews.map((item, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-200 group">
                          {item.type === "video" ? (
                            <div className="h-full w-full flex flex-col items-center justify-center bg-slate-900">
                               <Film size={16} className="text-white mb-1" />
                               <span className="text-[8px] text-white font-bold uppercase tracking-tighter">Video</span>
                            </div>
                          ) : (
                            <img src={item.url} className="w-full h-full object-cover" />
                          )}
                          <button
                            type="button"
                            onClick={() => removeGalleryItem(idx)}
                            className="absolute inset-0 bg-red-500/90 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      
                      {galleryPreviews.length < 12 && (
                        <label className="aspect-square bg-slate-50 border-2 border-dashed border-slate-100 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-blue-400 transition-all text-slate-400 hover:text-blue-500">
                          <Plus size={18} />
                          <span className="text-[9px] font-black uppercase mt-1">Add</span>
                          <input type="file" name="gallery" multiple className="hidden" accept="image/*,video/*" onChange={handleChange} />
                        </label>
                      )}
                    </div>
                  </div>
                )}

                <button
                  disabled={loading}
                  className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-[2px] shadow-lg shadow-slate-200 hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : (form._id ? "Update Content" : "Save Content")}
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}