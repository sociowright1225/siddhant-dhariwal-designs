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
} from "lucide-react";

const initialForm = {
  _id: null,
  title: "",
  category: "",
  price: "",
  description: "",
  status: "published",
  image: null,
};

const initialCatForm = {
  _id: null,
  name: "",
  thumbnail: null,
  preview: null,
};

const CATEGORY_OPTIONS = [
  "Wall Decor",
  "Pendent Light",
  "Table Lamp",
  "Chandelier",
  "Floor Light",
  "Home Decor",
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
  const fileInputRef = useRef(null);

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

  /* ---- Category CRUD ---- */
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!catForm.name) return alert("Category name is required");
    setCatLoading(true);
    const fd = new FormData();
    fd.append("name", catForm.name);
    if (catForm.thumbnail instanceof File) fd.append("thumbnail", catForm.thumbnail);
    try {
      catForm._id
        ? await api.put(`/products/categories/${catForm._id}`, fd)
        : await api.post("/products/categories", fd);
      setCatForm(initialCatForm);
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setCatLoading(false);
    }
  };

  const editCategory = (cat) => {
    setCatForm({ _id: cat._id, name: cat.name, thumbnail: null, preview: cat.thumbnail?.url || null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteCategory = async (id) => {
    if (!confirm("Delete this category?")) return;
    try { await api.delete(`/products/categories/${id}`); loadData(); }
    catch (err) { console.error(err); }
  };

  /* ---- Product CRUD ---- */
  const handleProductChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files?.[0]) {
      setForm((p) => ({ ...p, image: files[0] }));
      setMainPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
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
    if (fileInputRef.current) fileInputRef.current.value = "";
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
    });
    setMainPreview(item.mainImage?.url || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteItem = async (id) => {
    if (!confirm("Permanently delete this product?")) return;
    try { await api.delete(`/products/${id}`); loadData(); }
    catch (err) { console.error(err); }
  };

  const filteredItems = useMemo(() => items.filter((item) => {
    const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || item.category === activeTab;
    return matchesSearch && matchesTab;
  }), [items, searchQuery, activeTab]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">

      {/* Top Nav */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Store Administration</p>
          <h1 className="text-xl font-semibold text-gray-900">Inventory</h1>
        </div>
        <div className="flex items-center gap-2">
          {[{ label: "All", value: "all" }, ...categories.slice(0, 4).map((c) => ({ label: c.name, value: c.name }))].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.value
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto p-6 grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">

        {/* LEFT */}
        <div className="flex flex-col gap-6">

          {/* Collections */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-5">
              <LayoutGrid size={16} className="text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-700">Collections</h2>
            </div>

            {/* Existing categories */}
            {categories.length > 0 && (
              <div className="flex gap-3 flex-wrap mb-5">
                {categories.map((cat) => (
                  <div key={cat._id} className="group relative flex flex-col items-center gap-2">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      {cat.thumbnail?.url
                        ? <img src={cat.thumbnail.url} className="w-full h-full object-cover" alt={cat.name} />
                        : <div className="w-full h-full flex items-center justify-center"><Grid2x2 size={20} className="text-gray-300" /></div>
                      }
                    </div>
                    <span className="text-xs text-gray-500 text-center leading-tight max-w-[60px] truncate">{cat.name}</span>
                    <div className="absolute -top-1 -right-1 hidden group-hover:flex gap-1">
                      <button onClick={() => editCategory(cat)} className="w-5 h-5 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:border-blue-400">
                        <Edit3 size={10} className="text-gray-500" />
                      </button>
                      <button onClick={() => deleteCategory(cat._id)} className="w-5 h-5 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:border-red-400">
                        <Trash2 size={10} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add/edit category form */}
            <form onSubmit={handleCategorySubmit} className="flex items-end gap-3 pt-4 border-t border-gray-100">
              <div className="flex-1">
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">Collection name</label>
                <select
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400"
                >
                  <option value="">Select category...</option>
                  {CATEGORY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">Cover image</label>
                <div className="relative">
                  <div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-400 flex items-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors">
                    {catForm.preview
                      ? <><img src={catForm.preview} className="w-6 h-6 rounded object-cover" /><span className="text-xs text-gray-600">Image selected</span></>
                      : <><UploadCloud size={14} /><span className="text-xs">Upload image</span></>
                    }
                  </div>
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) setCatForm({ ...catForm, thumbnail: file, preview: URL.createObjectURL(file) });
                    }}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={catLoading}
                className="px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {catLoading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                {catForm._id ? "Update" : "Add"}
              </button>
              {catForm._id && (
                <button type="button" onClick={() => setCatForm(initialCatForm)} className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                  <X size={14} />
                </button>
              )}
            </form>
          </div>

          {/* Product List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-700">
                Products
                <span className="ml-2 text-gray-400 font-normal">· {filteredItems.length} items</span>
              </h2>
              <div className="relative w-60">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400 placeholder-gray-400"
                  placeholder="Search catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {fetching ? (
              <div className="h-64 bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center gap-3">
                <Loader2 size={24} className="animate-spin text-gray-400" />
                <span className="text-sm text-gray-400">Loading products...</span>
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item) => (
                  <div key={item._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden group hover:border-gray-300 hover:shadow-sm transition-all">
                    <div className="relative h-44 bg-gray-50 overflow-hidden">
                      {item.mainImage?.url
                        ? <img src={item.mainImage.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} />
                        : <div className="w-full h-full flex items-center justify-center"><Package size={32} className="text-gray-200" /></div>
                      }
                      <div className="absolute top-3 left-3">
                        <span className="text-xs bg-white border border-gray-200 text-gray-500 px-2 py-1 rounded-md">{item.category}</span>
                      </div>
                      <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => editProduct(item)}
                          className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:border-blue-400 transition-colors shadow-sm"
                        >
                          <Edit3 size={13} className="text-gray-500" />
                        </button>
                        <button
                          onClick={() => deleteItem(item._id)}
                          className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:border-red-300 transition-colors shadow-sm"
                        >
                          <Trash2 size={13} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-medium text-gray-900 truncate mb-2">{item.title}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${item.status === "published" ? "bg-green-500" : "bg-orange-400"}`} />
                          <span className="text-xs text-gray-400 capitalize">{item.status}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">${item.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 bg-white rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center gap-2">
                <Package size={32} className="text-gray-200" />
                <p className="text-sm text-gray-400">No products found</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: FORM */}
        <div>
          <div className="bg-white rounded-xl border border-gray-200 sticky top-6">
            {/* Form Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${form._id ? "bg-orange-400" : "bg-green-500"}`} />
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">{form._id ? "Edit mode" : "New product"}</p>
                  <h3 className="text-sm font-semibold text-gray-900">{form._id ? "Edit product" : "Add product"}</h3>
                </div>
              </div>
              {form._id && (
                <button onClick={resetProductForm} className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <X size={14} className="text-gray-400" />
                </button>
              )}
            </div>

            <form onSubmit={handleProductSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Title */}
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">Product title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleProductChange}
                  placeholder="Enter product name..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400 placeholder-gray-400"
                  required
                />
              </div>

              {/* Category + Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">Collection</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleProductChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400"
                    required
                  >
                    <option value="">Select...</option>
                    {categories.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">Price (USD)</label>
                  <div className="relative">
                    <DollarSign size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      name="price"
                      type="number"
                      value={form.price}
                      onChange={handleProductChange}
                      placeholder="0.00"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-3 py-2.5 text-sm outline-none focus:border-gray-400"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleProductChange}
                  placeholder="Describe the product..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400 placeholder-gray-400 resize-none h-24"
                />
              </div>

              {/* Status */}
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleProductChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gray-400"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wider mb-1.5 block">Main image</label>
                <div className="relative h-40 border border-dashed border-gray-200 rounded-lg bg-gray-50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors overflow-hidden">
                  {mainPreview ? (
                    <>
                      <img src={mainPreview} className="absolute inset-0 w-full h-full object-cover" alt="Preview" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <UploadCloud size={20} className="text-white" />
                      </div>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={20} className="text-gray-400" />
                      <span className="text-xs text-gray-400">Click to upload image</span>
                      <span className="text-xs text-gray-300">PNG, JPG up to 5MB</span>
                    </>
                  )}
                  <input
                    type="file"
                    name="image"
                    ref={fileInputRef}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleProductChange}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading
                  ? <><Loader2 size={15} className="animate-spin" /> Saving...</>
                  : <><CheckCircle2 size={15} /> {form._id ? "Save changes" : "Publish product"}</>
                }
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}