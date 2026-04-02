"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import api from "@/lib/api";
import {
  Plus, Trash2, Edit3, Search, Image as ImageIcon,
  Loader2, Package, X, MapPin,
  Film, Camera, Video, Calendar
} from "lucide-react";

const initialForm = {
  _id: null,
  title: "",
  category: "",
  description: "",
  location: "",
  date: "",
  status: "published",
  image: null,
  gallery: [],
};

export default function ProjectsTab() {
  const [items, setItems] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState(initialForm);
  const [preview, setPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const fileInputRef = useRef(null);

  const loadData = async () => {
    try {
      setFetching(true);
      const { data } = await api.get("/projects");
      setItems(Array.isArray(data) ? data : []);
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
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files?.[0]) {
      const file = files[0];
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    } else if (name === "gallery" && files) {
      const fileArray = Array.from(files);
      setForm(prev => ({ ...prev, gallery: [...prev.gallery, ...fileArray] }));
      const newPreviews = fileArray.map(file => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith("video") ? "video" : "image",
        isExisting: false
      }));
      setGalleryPreviews(prev => [...prev, ...newPreviews]);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleEdit = (item) => {
    const formattedDate = item.date ? new Date(item.date).toISOString().split('T')[0] : "";
    setForm({
      _id: item._id,
      title: item.title || "",
      category: item.category || "",
      description: item.description || "",
      location: item.location || "",
      date: formattedDate,
      status: item.status || "published",
      image: null,
      gallery: [],
    });
    setPreview(item.mainImage?.url || item.image?.url || null);
    if (item.gallery && Array.isArray(item.gallery)) {
      setGalleryPreviews(item.gallery.map(media => ({
        url: media.url,
        type: media.url.match(/\.(mp4|webm|ogg|mov)$/i) ? "video" : "image",
        isExisting: true,
        public_id: media.public_id
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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeGalleryItem = (index, item) => {
    if (item.isExisting) {
      if (!confirm("Hata dein? Yeh database se tabhi hatega jab aap Update click karenge.")) return;
    }
    setForm(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => {
        const existingCount = galleryPreviews.filter(p => p.isExisting).length;
        const relativeIndex = index - existingCount;
        return i !== relativeIndex;
      })
    }));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category) return alert("Title and Category are required");
    setLoading(true);
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("category", form.category);
    formData.append("description", form.description);
    formData.append("status", form.status);
    formData.append("location", form.location);
    formData.append("date", form.date);
    if (form.image instanceof File) formData.append("mainImage", form.image);
    form.gallery.forEach((file) => {
      if (file instanceof File) formData.append("gallery", file);
    });
    try {
      if (form._id) {
        await api.put(`/projects/${form._id}`, formData);
        alert("Project updated successfully!");
      } else {
        await api.post("/projects", formData);
        alert("New project published!");
      }
      resetForm();
      loadData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong while saving.");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    if (!confirm("Are you sure you want to delete this permanently?")) return;
    try {
      await api.delete(`/projects/${id}`);
      loadData();
    } catch {
      alert("Delete failed.");
    }
  };

  const filteredItems = useMemo(() =>
    items.filter(item => item.title?.toLowerCase().includes(searchQuery.toLowerCase())),
    [items, searchQuery]
  );

  return (
    <div>
      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight capitalize">
            Projects <span className="text-indigo-600 text-5xl">.</span>
          </h2>
          <p className="text-slate-500 font-medium mt-1">Manage your architectural portfolio.</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search projects..."
            className="pl-12 pr-6 py-4 bg-white border-none rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/10 w-full lg:w-96 shadow-sm transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Listing */}
        <div className="xl:col-span-7 space-y-6">
          {fetching ? (
            <div className="h-96 flex flex-col items-center justify-center bg-white rounded-[2rem] border border-slate-100 shadow-sm">
              <Loader2 size={48} className="animate-spin text-indigo-500 mb-4" />
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Syncing Database...</p>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map((item) => (
                <div key={item._id} className="group bg-white rounded-[2rem] p-4 border border-white hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500">
                  <div className="relative h-56 w-full rounded-[1.5rem] overflow-hidden bg-slate-100 mb-5">
                    {(item.mainImage?.url || item.image?.url) ? (
                      <img src={item.mainImage?.url || item.image?.url} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center"><ImageIcon className="text-slate-300" size={40} /></div>
                    )}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                      <button onClick={() => handleEdit(item)} className="p-3 bg-white/90 backdrop-blur rounded-xl text-indigo-600 shadow-xl hover:bg-indigo-600 hover:text-white transition-all"><Edit3 size={18} /></button>
                      <button onClick={() => deleteItem(item._id)} className="p-3 bg-white/90 backdrop-blur rounded-xl text-red-500 shadow-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1.5 bg-white/90 backdrop-blur rounded-lg text-[10px] font-black text-indigo-600 uppercase tracking-widest shadow-sm">{item.category}</span>
                    </div>
                  </div>
                  <div className="px-2 pb-2">
                    <h4 className="font-bold text-slate-800 text-lg leading-tight line-clamp-1 mb-2">{item.title}</h4>
                    {item.location && (
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                        <MapPin size={14} className="text-indigo-400" /> {item.location}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-40 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
              <Package size={64} className="mx-auto mb-6 text-slate-200" />
              <h3 className="text-xl font-bold text-slate-400">No projects found</h3>
              <p className="text-slate-300 text-sm mt-1">Try changing your search or add a new project.</p>
            </div>
          )}
        </div>

        {/* Form */}
        <div className="xl:col-span-5">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/60 sticky top-8 overflow-hidden">
            <div className="p-8 bg-slate-900 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">{form._id ? "Edit Project" : "Add Project"}</h3>
                  <p className="text-slate-400 text-[10px] uppercase font-black tracking-[0.2em] mt-1">Portfolio Manager</p>
                </div>
                {form._id && (
                  <button onClick={resetForm} className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-red-500 transition-colors">
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Project Title</label>
                  <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Modern Villa Redesign" className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl text-sm font-medium focus:bg-white focus:border-indigo-500 transition-all outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Category</label>
                    <input name="category" value={form.category} onChange={handleChange} required placeholder="e.g. Interior" className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl text-sm font-medium focus:bg-white focus:border-indigo-500 transition-all outline-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Completion</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input name="date" type="date" value={form.date} onChange={handleChange} className="w-full bg-slate-50 border-2 border-transparent pl-10 pr-4 py-4 rounded-2xl text-sm font-medium focus:bg-white focus:border-indigo-500 transition-all outline-none" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input name="location" value={form.location} onChange={handleChange} placeholder="City, Country" className="w-full bg-slate-50 border-2 border-transparent pl-11 pr-4 py-4 rounded-2xl text-sm font-medium focus:bg-white focus:border-indigo-500 transition-all outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Description</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Write something captivating..." className="w-full bg-slate-50 border-2 border-transparent p-4 rounded-2xl text-sm font-medium focus:bg-white focus:border-indigo-500 transition-all outline-none resize-none" />
                </div>
              </div>

              {/* Cover Image */}
              <div className="pt-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Camera size={14} className="text-indigo-500" /> Main Display Cover
                </label>
                <div className="relative group/cover h-60 w-full rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden hover:bg-white hover:border-indigo-300 transition-all cursor-pointer">
                  {preview ? (
                    <div className="relative h-full w-full">
                      <img src={preview} className="h-full w-full object-cover" alt="Cover Preview" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/cover:opacity-100 transition-opacity flex items-center justify-center">
                        <button type="button" onClick={(e) => { e.stopPropagation(); setPreview(null); setForm({ ...form, image: null }); }} className="p-3 bg-red-500 text-white rounded-2xl shadow-xl hover:scale-110 transition-transform">
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover/cover:scale-110 transition-transform">
                        <Plus className="text-indigo-500" size={28} />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Cover Photo</p>
                    </div>
                  )}
                  <input type="file" name="image" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleChange} />
                </div>
              </div>

              {/* Gallery */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Video size={14} className="text-indigo-500" /> Mixed Media Gallery
                  </label>
                  <span className="text-[10px] bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-black uppercase">{galleryPreviews.length} Items</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {galleryPreviews.map((item, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group/item shadow-sm">
                      {item.type === "video" ? (
                        <div className="h-full w-full flex flex-col items-center justify-center bg-slate-800">
                          <Film size={24} className="text-white/50" />
                          <span className="text-[7px] text-white/40 font-black uppercase mt-1">Video</span>
                        </div>
                      ) : (
                        <img src={item.url} className="w-full h-full object-cover" alt="" />
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/item:opacity-100 transition-all flex items-center justify-center">
                        <button type="button" onClick={() => removeGalleryItem(idx, item)} className="h-10 w-10 bg-red-500 text-white rounded-xl flex items-center justify-center hover:scale-110 transition-transform">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      {item.isExisting && <div className="absolute top-2 left-2 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white shadow-sm" title="Already Saved" />}
                    </div>
                  ))}
                  <label className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-indigo-400 transition-all group/btn">
                    <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover/btn:scale-110 transition-transform">
                      <Plus size={20} className="text-indigo-500" />
                    </div>
                    <span className="text-[8px] font-black text-slate-400 uppercase mt-2">Add Media</span>
                    <input type="file" name="gallery" multiple className="hidden" accept="image/*,video/*" onChange={handleChange} ref={fileInputRef} />
                  </label>
                </div>
              </div>

              <div className="pt-6">
                <button disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50">
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <Loader2 className="animate-spin" size={20} />
                      <span>Uploading...</span>
                    </div>
                  ) : (form._id ? "Update Project" : "Publish Project")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}