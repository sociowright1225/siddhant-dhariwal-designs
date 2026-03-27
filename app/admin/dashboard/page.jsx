"use client";

import React, { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import {
  Plus, Trash2, Edit3, Search, Image as ImageIcon,
  Loader2, Package, X, Briefcase, MapPin,
  Film, Check, AlertCircle, Camera, Video
} from "lucide-react";

/** * ARCHITECT ADMIN DASHBOARD 
 * Features: Multi-tab management, Mixed Media Gallery, 
 * Auto-previews, and Cloudinary Integration.
 */

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products"); // 'products' or 'projects'
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
    image: null,      // Main Cover File
    gallery: [],      // New Files to upload
  };

  const [form, setForm] = useState(initialForm);
  const [preview, setPreview] = useState(null); // Cover Preview
  const [galleryPreviews, setGalleryPreviews] = useState([]); // Array of {url, type, isExisting}

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

  // --- FORM LOGIC ---
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files?.[0]) {
      const file = files[0];
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    } 
    else if (name === "gallery" && files) {
      const fileArray = Array.from(files);
      setForm(prev => ({ ...prev, gallery: [...prev.gallery, ...fileArray] }));
      
      const newPreviews = fileArray.map(file => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith("video") ? "video" : "image",
        isExisting: false
      }));
      setGalleryPreviews(prev => [...prev, ...newPreviews]);
    } 
    else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleEdit = (item) => {
    // Format date for <input type="date"> (YYYY-MM-DD)
    const formattedDate = item.date ? new Date(item.date).toISOString().split('T')[0] : "";
    
    setForm({
      _id: item._id,
      title: item.title || "",
      category: item.category || "",
      price: item.price || "",
      description: item.description || "",
      location: item.location || "",
      date: formattedDate,
      status: item.status || "published",
      image: null,
      gallery: [], // We only put NEW files here
    });

    setPreview(item.image?.url || null);
    
    // Show existing gallery items in preview
    if (item.gallery) {
      setGalleryPreviews(item.gallery.map(img => ({
        url: img.url,
        type: img.url.match(/\.(mp4|webm|ogg|mov)$/i) ? "video" : "image",
        isExisting: true,
        public_id: img.public_id
      })));
    } else {
      setGalleryPreviews([]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setForm(initialForm);
    setPreview(null);
    setGalleryPreviews([]);
  };

  const removeGalleryItem = async (index, item) => {
    if (item.isExisting) {
      // In a real app, you'd call a DELETE API here to remove from Cloudinary immediately
      // For now, we'll just filter it out from the local view
      if(!confirm("Remove this permanently from the project?")) return;
    }
    
    setForm(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => {
          // Logic to remove only the correct 'File' from the gallery array
          const fileIndex = item.isExisting ? -1 : index - galleryPreviews.filter(p => p.isExisting).length;
          return i !== fileIndex;
      })
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

      // Append only NEW gallery files
      if (activeTab === "projects") {
        form.gallery.forEach((file) => {
          formData.append("gallery", file);
        });
      }

      if (form._id) {
        await api.put(`${endpoint}/${form._id}`, formData);
        alert("Updated successfully!");
      } else {
        await api.post(endpoint, formData);
        alert("Created successfully!");
      }
      
      resetForm();
      loadData();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Failed to save"));
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await api.delete(`/${activeTab}/${id}`);
      loadData();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // --- FILTERING ---
  const filteredItems = useMemo(() => {
    return items.filter((p) => {
      const titleMatch = p.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const catMatch = filterCategory === "All" || p.category === filterCategory;
      return titleMatch && catMatch;
    });
  }, [items, searchQuery, filterCategory]);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 antialiased font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-72 border-r border-slate-200 bg-white flex flex-col fixed h-full shadow-sm z-10">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-indigo-200 shadow-lg">
              <Briefcase className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">Studio Admin</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Architectural v2</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-2">
          <button
            onClick={() => setActiveTab("products")}
            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "products" 
              ? "bg-indigo-50 text-indigo-700 shadow-sm" 
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Package size={20} /> Shop Products
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === "projects" 
              ? "bg-indigo-50 text-indigo-700 shadow-sm" 
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Briefcase size={20} /> Portfolio Projects
          </button>
        </nav>

        <div className="p-8 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
             <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-xs font-medium text-slate-600">Server Connected</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-72 p-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-900 capitalize tracking-tight">
              {activeTab} <span className="text-indigo-600">.</span>
            </h2>
            <p className="text-slate-500 font-medium mt-1">Manage your digital storefront and architectural portfolio.</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 w-80 shadow-sm transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          
          {/* LEFT: LIST VIEW */}
          <div className="xl:col-span-7">
            {fetching ? (
              <div className="h-96 flex flex-col items-center justify-center text-slate-400 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <Loader2 size={40} className="animate-spin text-indigo-500 mb-4" />
                <p className="font-medium">Fetching your data...</p>
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filteredItems.map((item) => (
                  <div key={item._id} className="group p-5 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-500/5 flex flex-col">
                    <div className="h-44 w-full bg-slate-100 rounded-xl overflow-hidden mb-4 relative">
                      {item.image?.url ? (
                        <img src={item.image.url} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center"><ImageIcon className="text-slate-300" size={32} /></div>
                      )}
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => handleEdit(item)} className="p-2.5 bg-white/90 backdrop-blur rounded-lg text-slate-700 hover:text-indigo-600 shadow-sm"><Edit3 size={16}/></button>
                         <button onClick={() => deleteItem(item._id)} className="p-2.5 bg-white/90 backdrop-blur rounded-lg text-slate-700 hover:text-red-500 shadow-sm"><Trash2 size={16}/></button>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{item.category}</span>
                        {item.price && <span className="text-sm font-bold text-slate-900">${item.price}</span>}
                      </div>
                      <h4 className="font-bold text-slate-800 text-lg leading-snug truncate">{item.title}</h4>
                      {item.location && <div className="flex items-center gap-1 text-slate-400 text-xs mt-1"><MapPin size={12}/> {item.location}</div>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-32 text-center bg-white border-2 border-dashed border-slate-200 rounded-3xl text-slate-400">
                <Package size={48} className="mx-auto mb-4 opacity-20" />
                <p className="font-medium text-slate-500">No items found matching your criteria.</p>
              </div>
            )}
          </div>

          {/* RIGHT: FORM VIEW */}
          <div className="xl:col-span-5">
            <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 sticky top-12 overflow-hidden">
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">{form._id ? "Edit Details" : "Create New"}</h3>
                  <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">{activeTab} Entry</p>
                </div>
                {form._id && (
                  <button onClick={resetForm} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Title</label>
                    <input 
                      name="title" 
                      value={form.title} 
                      onChange={handleChange} 
                      required 
                      placeholder="e.g. Modern Concrete Villa"
                      className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                      <select name="category" value={form.category} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm focus:border-indigo-500 outline-none appearance-none" required>
                        <option value="">Select...</option>
                        <option value="Wall Decor">Wall Decor</option>
                        <option value="Pendent Light">Pendent Light</option>
                        <option value="Table Lamp">Table Lamp</option>
                        <option value="Chandelier">Chandelier</option>
                        <option value="Floor Light">Floor Light</option>
                        <option value="Home Decor">Home Decor</option>
                        
                      </select>
                    </div>*/}
                    
                    {activeTab === "products" ? (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price ($)</label>
                        <input name="price" type="number" value={form.price} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm focus:border-indigo-500 outline-none" />
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completion Date</label>
                        <input name="date" type="date" value={form.date} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm focus:border-indigo-500 outline-none" />
                      </div>
                    )}
                  </div>

                  {activeTab === "projects" && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input name="location" value={form.location} onChange={handleChange} placeholder="Mumbai, MH" className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3.5 rounded-xl text-sm focus:border-indigo-500 outline-none" />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Tell the story of this project..." className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm outline-none focus:border-indigo-500" />
                  </div>
                </div>

                {/* Cover Image */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Camera size={14} /> Main Cover Image
                  </label>
                  <div className="group relative border-2 border-dashed border-slate-200 rounded-2xl p-2 bg-slate-50/50 hover:bg-white hover:border-indigo-300 transition-all">
                    {preview ? (
                      <div className="relative h-48 w-full rounded-xl overflow-hidden shadow-inner">
                        <img src={preview} className="h-full w-full object-cover" alt="Preview" />
                        <button type="button" onClick={() => {setPreview(null); setForm({...form, image: null})}} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition-colors"><X size={16}/></button>
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100">
                          <Plus className="text-indigo-500" size={24} />
                        </div>
                        <p className="text-xs text-slate-400 font-bold uppercase">Click to upload cover</p>
                        <p className="text-[10px] text-slate-300 mt-1">PNG, JPG up to 10MB</p>
                      </div>
                    )}
                    <input type="file" name="image" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleChange} />
                  </div>
                </div>

                {/* Project Gallery (Mixed Media) */}
                {activeTab === "projects" && (
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <Video size={14} /> Project Gallery
                      </label>
                      <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2.5 py-1 rounded-full font-bold uppercase">{galleryPreviews.length} Items</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      {galleryPreviews.map((item, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group/item shadow-sm">
                          {item.type === "video" ? (
                            <div className="h-full w-full flex flex-col items-center justify-center bg-slate-900">
                               <Film size={20} className="text-white mb-1 opacity-80" />
                               <span className="text-[8px] text-white/60 font-black uppercase tracking-tighter">Video</span>
                            </div>
                          ) : (
                            <img src={item.url} className="w-full h-full object-cover" alt="Gallery item" />
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-all flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => removeGalleryItem(idx, item)}
                              className="h-8 w-8 bg-red-500 text-white rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          {item.isExisting && <div className="absolute top-1 left-1 h-1.5 w-1.5 bg-green-500 rounded-full border border-white" />}
                        </div>
                      ))}
                      
                      {galleryPreviews.length < 15 && (
                        <label className="aspect-square bg-white border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group">
                          <Plus size={20} className="text-slate-300 group-hover:text-indigo-500" />
                          <span className="text-[9px] font-black text-slate-400 group-hover:text-indigo-600 uppercase mt-1">Add Media</span>
                          <input type="file" name="gallery" multiple className="hidden" accept="image/*,video/*" onChange={handleChange} />
                        </label>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <button
                    disabled={loading}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm uppercase tracking-[2px] shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:translate-y-[-2px] active:translate-y-[0px] transition-all disabled:opacity-50 disabled:translate-y-0"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-3">
                        <Loader2 className="animate-spin" size={18} />
                        <span>Processing...</span>
                      </div>
                    ) : (form._id ? "Update Portfolio" : "Publish to Portfolio")}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
