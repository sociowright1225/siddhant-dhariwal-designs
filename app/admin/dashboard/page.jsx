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
  Filter,
  ArrowUpDown,
  LayoutDashboard,
  Briefcase,
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products"); // 'products' or 'projects'
  const [items, setItems] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const initialForm = {
    _id: null,
    title: "",
    category: "",
    price: "",
    description: "",
    status: "published",
    image: null,
  };

  const [form, setForm] = useState(initialForm);
  const [preview, setPreview] = useState(null);

  // --- LOAD DATA BASED ON TAB ---
  const loadData = async () => {
    try {
      setFetching(true);
      // Switches endpoint based on active tab
      const endpoint = activeTab === "products" ? "/products" : "/projects";
      const { data } = await api.get(endpoint);
      setItems(data);
    } catch (err) {
      console.error(`Fetch error (${activeTab}):`, err);
      setItems([]); 
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadData();
    resetForm(); // Tab change hone par form reset ho jaye
  }, [activeTab]);

  // Unique categories for filtering
  const categories = useMemo(() => {
    const cats = items.map((p) => p.category).filter(Boolean);
    return ["All", ...new Set(cats)];
  }, [items]);

  // Filter and Sort Logic
  const filteredItems = useMemo(() => {
    return items
      .filter((p) => {
        const matchesSearch =
          p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          filterCategory === "All" || p.category === filterCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return (a.price || 0) - (b.price || 0);
        if (sortBy === "price-high") return (b.price || 0) - (a.price || 0);
        if (sortBy === "alphabetical") return a.title.localeCompare(b.title);
        return 0;
      });
  }, [items, searchQuery, filterCategory, sortBy]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      const file = files[0];
      setForm({ ...form, image: file });
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleEdit = (item) => {
    setForm({
      _id: item._id,
      title: item.title,
      category: item.category,
      price: item.price || "",
      description: item.description || "",
      status: item.status || "published",
      image: null,
    });
    setPreview(item.image?.url || null);
  };

  const resetForm = () => {
    setForm(initialForm);
    if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = activeTab === "products" ? "/products" : "/projects";
    
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (key === "image" && form[key] instanceof File) {
          formData.append("image", form[key]);
        } else if (form[key] !== null) {
          formData.append(key, form[key]);
        }
      });

      if (form._id) {
        await api.put(`${endpoint}/${form._id}`, formData);
      } else {
        await api.post(endpoint, formData);
      }
      resetForm();
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id) => {
    if (!confirm(`Delete this ${activeTab.slice(0, -1)} permanently?`)) return;
    const endpoint = activeTab === "products" ? "/products" : "/projects";
    try {
      await api.delete(`${endpoint}/${id}`);
      loadData();
      if (form._id === id) resetForm();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-50 shadow-xl">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold flex items-center gap-3">
            <LayoutDashboard className="text-indigo-400" /> Admin
          </h1>
        </div>
        
        <nav className="flex-1 p-4 mt-4 space-y-2">
          <button
            onClick={() => setActiveTab("products")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === "products"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Package size={20} /> 
            <span className="font-medium">Products</span>
          </button>

          <button
            onClick={() => setActiveTab("projects")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === "projects"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <Briefcase size={20} /> 
            <span className="font-medium">Projects</span>
          </button>
        </nav>

        <div className="p-6 border-t border-slate-800">
          <div className="bg-slate-800 rounded-lg p-3 text-xs text-slate-400">
            Logged in as Admin
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-8 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 capitalize">
                {activeTab}
              </h2>
              <p className="text-slate-500 mt-1">Manage your website's {activeTab} gallery and details.</p>
            </div>
          </header>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* LIST SECTION */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder={`Search ${activeTab}...`}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm bg-white px-3 py-2 border border-gray-200 rounded-xl">
                      <Filter size={14} className="text-gray-400" />
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="bg-transparent font-medium outline-none cursor-pointer"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto max-h-[calc(100vh-300px)]">
                {fetching ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <Loader2 className="animate-spin mb-3 text-indigo-500" size={32} />
                    <p>Fetching {activeTab}...</p>
                  </div>
                ) : filteredItems.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {filteredItems.map((item) => (
                      <div key={item._id} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors group">
                        <div className="h-16 w-16 rounded-xl bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                          {item.image?.url ? (
                            <img src={item.image.url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center"><ImageIcon size={20} className="text-gray-300" /></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-800 truncate">{item.title}</h4>
                          <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 uppercase font-bold">{item.category}</span>
                          {activeTab === "products" && <p className="text-indigo-600 font-bold text-sm mt-1">₹{item.price}</p>}
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(item)} className="p-2 bg-white text-slate-600 hover:text-indigo-600 border border-gray-200 rounded-lg shadow-sm"><Edit3 size={16} /></button>
                          <button onClick={() => removeItem(item._id)} className="p-2 bg-white text-slate-600 hover:text-red-600 border border-gray-200 rounded-lg shadow-sm"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center text-gray-400">No items found in {activeTab}</div>
                )}
              </div>
            </div>

            {/* FORM SECTION */}
            <div className="w-full lg:w-[420px]">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden sticky top-8">
                <div className="p-5 border-b border-gray-100 bg-slate-800 text-white flex justify-between items-center">
                  <h3 className="font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                    {form._id ? <Edit3 size={16} /> : <Plus size={16} />}
                    {form._id ? `Edit ${activeTab.slice(0,-1)}` : `Add ${activeTab.slice(0,-1)}`}
                  </h3>
                  {form._id && <button onClick={resetForm} className="hover:rotate-90 transition-transform"><X size={20} /></button>}
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-tight">Title</label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      className="w-full border-b-2 border-gray-100 py-2 focus:border-indigo-500 outline-none transition-colors"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-tight">Category</label>
                      <input
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full border-b-2 border-gray-100 py-2 focus:border-indigo-500 outline-none transition-colors"
                        required
                      />
                    </div>
                    {activeTab === "products" && (
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-tight">Price (₹)</label>
                        <input
                          name="price"
                          type="number"
                          value={form.price}
                          onChange={handleChange}
                          className="w-full border-b-2 border-gray-100 py-2 focus:border-indigo-500 outline-none transition-colors"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-tight">Description</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full border border-gray-100 rounded-xl p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-tight">Featured Image</label>
                    <div className="relative group border-2 border-dashed border-gray-200 rounded-2xl p-4 hover:border-indigo-400 transition-all cursor-pointer bg-slate-50 flex items-center justify-center min-h-[160px]">
                      {preview ? (
                        <div className="relative w-full h-32">
                          <img src={preview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setPreview(null); setForm({...form, image: null}); }}
                            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1.5 shadow-lg"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="bg-white p-3 rounded-full shadow-sm inline-block mb-2 text-slate-400 group-hover:text-indigo-500 transition-colors">
                            <ImageIcon size={24} />
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium">Click to upload or drag & drop</p>
                        </div>
                      )}
                      <input name="image" type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleChange} />
                    </div>
                  </div>

                  <button
                    disabled={loading}
                    className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 
                      ${form._id ? "bg-indigo-600 hover:bg-indigo-700" : "bg-emerald-500 hover:bg-emerald-600 hover:-translate-y-0.5"} 
                      disabled:opacity-50 active:scale-95`}
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : form._id ? `Update ${activeTab.slice(0,-1)}` : `Save ${activeTab.slice(0,-1)}`}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}