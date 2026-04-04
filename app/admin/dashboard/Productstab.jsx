"use client";

import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import api from "@/lib/api";
import {
  Plus,
  Trash2,
  Edit3,
  Search,
  Loader2,
  Package,
  X,
  DollarSign,
  UploadCloud,
  CheckCircle2,
  LayoutGrid,
  Grid2x2,
  Image as ImageIcon,
} from "lucide-react";

const initialForm = {
  _id: null,
  title: "",
  category: "",
  price: "",
  description: "",
  status: "published",
  image: null,
  gallery: [], // Added for multiple files
};

const initialCatForm = {
  _id: null,
  name: "",
  thumbnail: null,
  preview: null,
};

const CATEGORY_OPTIONS = [
  "Wall Light",
  "Pendant Light",
  "Table Lamp",
  "Chandelier",
  "Floor Light",
  "Home Decor",
   "Totems",
];

export default function ProductsTab() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [catLoading, setCatLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const [catForm, setCatForm] = useState(initialCatForm);
  const [form, setForm] = useState(initialForm);
  const [mainPreview, setMainPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]); // Array of {url, isExisting, file}

  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const loadData = useCallback(async () => {
    try {
      setFetching(true);
      const [prodRes, catRes] = await Promise.all([
        api.get("/products"),
        api.get("/products/categories"),
      ]);
      setItems(Array.isArray(prodRes.data) ? prodRes.data : []);
      setCategories(Array.isArray(catRes.data) ? catRes.data : []);
    } catch (err) {
      console.error("Sync error:", err);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  /* ---- Product CRUD Handlers ---- */
  const handleProductChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "image" && files?.[0]) {
      setForm((p) => ({ ...p, image: files[0] }));
      setMainPreview(URL.createObjectURL(files[0]));
    } 
    else if (name === "gallery" && files) {
      const fileArray = Array.from(files);
      setForm((p) => ({ ...p, gallery: [...p.gallery, ...fileArray] }));
      
      const newPreviews = fileArray.map(file => ({
        url: URL.createObjectURL(file),
        isExisting: false,
        file: file
      }));
      setGalleryPreviews(prev => [...prev, ...newPreviews]);
    } 
    else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const removeGalleryItem = (index, isExisting) => {
    if (isExisting) {
      setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
      // Note: In a real app, you'd track deleted IDs to remove from DB on Submit
    } else {
      const itemToRemove = galleryPreviews[index];
      setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
      setForm(prev => ({
        ...prev,
        gallery: prev.gallery.filter(f => f !== itemToRemove.file)
      }));
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    fd.append("title", form.title.trim());
    fd.append("category", form.category);
    fd.append("price", form.price);
    fd.append("description", form.description);
    fd.append("status", form.status);
    
    if (form.image instanceof File) fd.append("mainImage", form.image);
    
    // Append Gallery Images
    form.gallery.forEach((file) => {
      fd.append("gallery", file);
    });

    try {
      form._id
        ? await api.put(`/products/${form._id}`, fd)
        : await api.post("/products", fd);
      resetProductForm();
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetProductForm = () => {
    setForm(initialForm);
    setMainPreview(null);
    setGalleryPreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  const editProduct = (item) => {
    setForm({
      _id: item._id,
      title: item.title,
      category: item.category,
      price: item.price,
      description: item.description,
      status: item.status || "published",
      image: null,
      gallery: [],
    });
    setMainPreview(item.mainImage?.url || null);
    
    // Set existing gallery previews from DB
    const existing = item.gallery?.map(img => ({
      url: img.url,
      isExisting: true
    })) || [];
    setGalleryPreviews(existing);
    
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ---- Category CRUD (No Changes) ---- */
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!catForm.name) return alert("Category name is required");
    setCatLoading(true);
    const fd = new FormData();
    fd.append("name", catForm.name);
    if (catForm.thumbnail instanceof File) fd.append("thumbnail", catForm.thumbnail);
    try {
      catForm._id ? await api.put(`/products/categories/${catForm._id}`, fd) : await api.post("/products/categories", fd);
      setCatForm(initialCatForm);
      loadData();
    } catch (err) { console.error(err); } finally { setCatLoading(false); }
  };

  const editCategory = (cat) => {
    setCatForm({ _id: cat._id, name: cat.name, thumbnail: null, preview: cat.thumbnail?.url || null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteCategory = async (id) => {
    if (!confirm("Delete this category?")) return;
    try { await api.delete(`/products/categories/${id}`); loadData(); } catch (err) { console.error(err); }
  };

  const deleteItem = async (id) => {
    if (!confirm("Permanently delete this product?")) return;
    try { await api.delete(`/products/${id}`); loadData(); } catch (err) { console.error(err); }
  };

  const filteredItems = useMemo(() => items.filter((item) => {
    const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || item.category === activeTab;
    return matchesSearch && matchesTab;
  }), [items, searchQuery, activeTab]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Store Administration</p>
          <h1 className="text-xl font-semibold text-gray-900">Inventory Hub</h1>
        </div>
        <div className="flex items-center gap-2">
          {[{ label: "All", value: "all" }, ...categories.slice(0, 4).map((c) => ({ label: c.name, value: c.name }))].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.value ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto p-6 grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6">
        
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6">
          {/* Category Section - Same as yours */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-5">
              <LayoutGrid size={16} className="text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-700">Collections</h2>
            </div>
            
            <div className="flex gap-3 flex-wrap mb-5">
                {categories.map((cat) => (
                  <div key={cat._id} className="group relative flex flex-col items-center gap-2">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      {cat.thumbnail?.url 
                        ? <img src={cat.thumbnail.url} className="w-full h-full object-cover" alt="" />
                        : <div className="w-full h-full flex items-center justify-center"><Grid2x2 size={20} className="text-gray-300" /></div>
                      }
                    </div>
                    <span className="text-xs text-gray-500 max-w-[60px] truncate">{cat.name}</span>
                    <div className="absolute -top-1 -right-1 hidden group-hover:flex gap-1">
                      <button onClick={() => editCategory(cat)} className="w-5 h-5 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm"><Edit3 size={10} /></button>
                      <button onClick={() => deleteCategory(cat._id)} className="w-5 h-5 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm"><Trash2 size={10} className="text-red-400" /></button>
                    </div>
                  </div>
                ))}
            </div>

            <form onSubmit={handleCategorySubmit} className="flex items-end gap-3 pt-4 border-t border-gray-100">
               <div className="flex-1">
                  <select value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400">
                    <option value="">Select name...</option>
                    {CATEGORY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
               </div>
               <div className="relative flex-1">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400 flex items-center gap-2 truncate">
                    {catForm.preview ? <span className="text-gray-600">Image Set</span> : "Cover Image"}
                  </div>
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                    const f = e.target.files[0];
                    if(f) setCatForm({...catForm, thumbnail: f, preview: URL.createObjectURL(f)});
                  }}/>
               </div>
               <button type="submit" disabled={catLoading} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium">
                 {catLoading ? "..." : (catForm._id ? "Update" : "Add")}
               </button>
            </form>
          </div>

          {/* Product Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-700 text-opacity-80 uppercase tracking-tight">Active Inventory</h2>
              <div className="relative w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => (
                <div key={item._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden group hover:shadow-md transition-all">
                  <div className="relative h-48 bg-gray-50">
                    <img src={item.mainImage?.url} className="w-full h-full object-cover" alt="" />
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => editProduct(item)} className="p-2 bg-white rounded-lg shadow-sm hover:text-blue-500"><Edit3 size={14}/></button>
                      <button onClick={() => deleteItem(item._id)} className="p-2 bg-white rounded-lg shadow-sm hover:text-red-500"><Trash2 size={14}/></button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-400 mb-1">{item.category}</p>
                    <p className="text-sm font-semibold truncate mb-2">{item.title}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-900">${item.price}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{item.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: EDITOR FORM */}
        <div className="relative">
          <div className="bg-white rounded-xl border border-gray-200 sticky top-24 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${form._id ? "bg-orange-400" : "bg-green-500"}`} />
                <h3 className="text-sm font-bold text-gray-800">{form._id ? "Edit Product" : "Create Product"}</h3>
              </div>
              {form._id && <button onClick={resetProductForm} className="text-gray-400 hover:text-gray-600"><X size={16}/></button>}
            </div>

            <form onSubmit={handleProductSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Basic Fields */}
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Title</label>
                  <input name="title" value={form.title} onChange={handleProductChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400" required />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Category</label>
                    <select name="category" value={form.category} onChange={handleProductChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-2 text-sm outline-none" required>
                      <option value="">Select...</option>
                      {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Price ($)</label>
                    <input name="price" type="number" value={form.price} onChange={handleProductChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" required />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Description</label>
                  <textarea name="description" value={form.description} onChange={handleProductChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none h-20 resize-none" />
                </div>
              </div>

              {/* Main Image */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Main Cover</label>
                <div className="relative h-32 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center bg-gray-50 group overflow-hidden">
                  {mainPreview ? (
                    <img src={mainPreview} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <div className="text-center text-gray-400">
                      <UploadCloud size={20} className="mx-auto mb-1" />
                      <span className="text-[10px]">Upload Cover</span>
                    </div>
                  )}
                  <input type="file" name="image" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleProductChange} />
                </div>
              </div>

              {/* Gallery Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-gray-400 uppercase block">Product Gallery</label>
                  <span className="text-[9px] bg-gray-100 px-2 py-0.5 rounded text-gray-500">Multiple allowed</span>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {/* Upload Trigger */}
                  <div className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 relative cursor-pointer group">
                    <Plus size={16} className="text-gray-400 group-hover:scale-110 transition-transform"/>
                    <input type="file" name="gallery" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleProductChange} />
                  </div>

                  {/* Preview Items */}
                  {galleryPreviews.map((item, idx) => (
                    <div key={idx} className="aspect-square rounded-lg border border-gray-100 relative group overflow-hidden bg-gray-100">
                      <img src={item.url} className="w-full h-full object-cover" alt="" />
                      <div className={`absolute top-0 left-0 px-1 text-[7px] font-bold text-white uppercase ${item.isExisting ? 'bg-blue-500' : 'bg-green-500'}`}>
                        {item.isExisting ? 'Cloud' : 'New'}
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeGalleryItem(idx, item.isExisting)}
                        className="absolute top-0 right-0 p-1 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                {form._id ? "Update Changes" : "Publish Product"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}