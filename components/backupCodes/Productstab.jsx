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
  Image as ImageIcon,
  Loader2,
  Package,
  X,
  DollarSign,
  Camera,
  FolderPlus,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Layers,
  LayoutGrid,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

/* ==========================================================================
   INITIAL STATES & CONSTANTS
   ========================================================================== */
const initialForm = {
  _id: null,
  title: "",
  category: "",
  price: "",
  description: "",
  status: "published",
  image: null, // For mainImage File
  gallery: [], // For new gallery Files
};

const initialCatForm = {
  _id: null,
  name: "",
  thumbnail: null,
  preview: null,
};

export default function ProductsTab() {
  /* ==========================================================================
     STATE MANAGEMENT
     ========================================================================== */
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [catLoading, setCatLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Category State
  const [catForm, setCatForm] = useState(initialCatForm);

  // Product State
  const [form, setForm] = useState(initialForm);
  const [mainPreview, setMainPreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]); // {url, file, isExisting}

  // Refs
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const formRef = useRef(null);

  /* ==========================================================================
     DATA SYNC (FETCHING)
     ========================================================================== */
  const loadData = useCallback(async () => {
    try {
      setFetching(true);
      const [prodRes, catRes] = await Promise.all([
        api.get("/products"),
        api.get("/products/categories"),
      ]);

      // Safety checks for data format
      const products = Array.isArray(prodRes.data) ? prodRes.data : [];
      const cats = Array.isArray(catRes.data) ? catRes.data : [];

      setItems(products);
      setCategories(cats);
    } catch (err) {
      console.error("Critical Sync Error:", err);
      toast("Error syncing data with server", "error");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ==========================================================================
     UTILITY FUNCTIONS
     ========================================================================== */
  const toast = (msg, type = "success") => {
    // Custom toast implementation logic can go here
    alert(`${type.toUpperCase()}: ${msg}`);
  };

  const scrollToForm = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ==========================================================================
     CATEGORY HANDLERS (CRUD)
     ========================================================================== */
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!catForm.name) return toast("Category name is required", "error");

    setCatLoading(true);
    const formData = new FormData();
    formData.append("name", catForm.name);
    if (catForm.thumbnail instanceof File) {
      formData.append("thumbnail", catForm.thumbnail);
    }

    try {
      if (catForm._id) {
        await api.put(`/products/categories/${catForm._id}`, formData);
        toast("Category updated successfully");
      } else {
        await api.post("/products/categories", formData);
        toast("New category created");
      }
      setCatForm(initialCatForm);
      loadData();
    } catch (err) {
      toast(
        err.response?.data?.message || "Category operation failed",
        "error",
      );
    } finally {
      setCatLoading(false);
    }
  };

  const editCategory = (cat) => {
    setCatForm({
      _id: cat._id,
      name: cat.name,
      thumbnail: null,
      preview: cat.thumbnail?.url || null,
    });
    scrollToForm();
  };

  const deleteCategory = async (id) => {
    if (
      !confirm(
        "Are you sure? This will not delete products but will remove this category grouping.",
      )
    )
      return;
    try {
      await api.delete(`/products/categories/${id}`);
      toast("Category removed");
      loadData();
    } catch (err) {
      toast("Failed to delete category", "error");
    }
  };

  /* ==========================================================================
     PRODUCT HANDLERS (CRUD & MULTIPLE IMAGES)
     ========================================================================== */
  const handleProductChange = (e) => {
    const { name, value, files } = e.target;

    // Handle Main Single Image
    if (name === "image" && files?.[0]) {
      const file = files[0];
      setForm((prev) => ({ ...prev, image: file }));
      setMainPreview(URL.createObjectURL(file));
    }
    // Handle Multiple Gallery Images
    else if (name === "gallery" && files) {
      const fileArray = Array.from(files);

      // Update Files in state
      setForm((prev) => ({
        ...prev,
        gallery: [...prev.gallery, ...fileArray],
      }));

      // Update Previews
      const newPreviews = fileArray.map((file) => ({
        url: URL.createObjectURL(file),
        isExisting: false,
        file: file, // Store file reference to identify for removal
      }));

      setGalleryPreviews((prev) => [...prev, ...newPreviews]);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const removeGalleryItem = (index, isExisting) => {
    if (isExisting) {
      // In a real app, you might want to call an API or track IDs to delete on Save
      // For now, we just remove it from UI state
      setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    } else {
      // Remove from Preview
      const itemToRemove = galleryPreviews[index];
      setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));

      // Remove from Form Files state
      setForm((prev) => ({
        ...prev,
        gallery: prev.gallery.filter((file) => file !== itemToRemove.file),
      }));
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();

    // Append Text Fields
    formData.append("title", form.title.trim());
    formData.append("category", form.category);
    formData.append("price", form.price);
    formData.append("description", form.description);
    formData.append("status", form.status);

    // Append Main Image
    if (form.image instanceof File) {
      formData.append("mainImage", form.image);
    }

    // Append Gallery Files (Multiple)
    form.gallery.forEach((file) => {
      formData.append("gallery", file);
    });

    try {
      if (form._id) {
        await api.put(`/products/${form._id}`, formData);
        toast("Product updated successfully");
      } else {
        await api.post("/products", formData);
        toast("Product published to store");
      }
      resetProductForm();
      loadData();
    } catch (err) {
      console.error(err);
      toast("Error processing product request", "error");
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

    // Set existing gallery previews
    const existingGallery =
      item.gallery?.map((img) => ({
        url: img.url,
        isExisting: true,
        public_id: img.public_id,
      })) || [];

    setGalleryPreviews(existingGallery);
    scrollToForm();
  };

  const deleteItem = async (id) => {
    if (!confirm("Permanent delete this product? This cannot be undone."))
      return;
    try {
      await api.delete(`/products/${id}`);
      toast("Product deleted");
      loadData();
    } catch (err) {
      toast("Delete operation failed", "error");
    }
  };

  /* ==========================================================================
     FILTER & SEARCH LOGIC
     ========================================================================== */
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === "all" || item.category === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [items, searchQuery, activeTab]);

  /* ==========================================================================
     RENDER UI
     ========================================================================== */
  return (
    <div className="max-w-[1700px] mx-auto p-4 lg:p-12 bg-[#f8fafc] min-h-screen font-sans text-slate-900">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-[0.3em] mb-2">
            <Layers size={14} />
            <span>Storefront Administration</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter">
            Inventory <span className="text-indigo-600">Hub.</span>
          </h1>
        </div>

        <div className="flex gap-3 bg-white p-2 rounded-[2rem] shadow-sm border border-slate-200">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${activeTab === "all" ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"}`}
          >
            All Items
          </button>
          {categories.slice(0, 3).map((c) => (
            <button
              key={c._id}
              onClick={() => setActiveTab(c.name)}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${activeTab === c.name ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* LEFT COLUMN: MANAGEMENT & LISTING */}
        <div className="xl:col-span-7 space-y-12">
          {/* CATEGORY QUICK ADD */}
          <section className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 transition-transform">
              <FolderPlus size={120} />
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                <LayoutGrid size={24} />
              </div>
              <h2 className="text-2xl font-black">Collection Manager</h2>
            </div>

            <form
              onSubmit={handleCategorySubmit}
              className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end"
            >
              <div className="md:col-span-5 space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Collection Name
                </label>
                <input
                  value={catForm.name}
                  onChange={(e) =>
                    setCatForm({ ...catForm, name: e.target.value })
                  }
                  placeholder="Category Name..."
                  className="w-full bg-slate-50 p-4 rounded-2xl outline-none border-2 border-transparent focus:border-indigo-500 transition-all font-semibold"
                />
              </div>

              <div className="md:col-span-4 space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Cover Asset
                </label>
                <div className="relative h-[60px] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                  {catForm.preview ? (
                    <div className="flex items-center gap-3 px-4 w-full">
                      <img
                        src={catForm.preview}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <span className="text-xs font-bold text-indigo-600 truncate">
                        Asset Ready
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Camera size={18} />
                      <span className="text-xs font-bold">Upload Image</span>
                    </div>
                  )}
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file)
                        setCatForm({
                          ...catForm,
                          thumbnail: file,
                          preview: URL.createObjectURL(file),
                        });
                    }}
                  />
                </div>
              </div>

              <div className="md:col-span-3">
                <button
                  disabled={catLoading}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
                >
                  {catLoading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <>
                      <Plus size={16} /> {catForm._id ? "Update" : "Add"}
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Horizontal Category List */}
            <div className="flex gap-4 overflow-x-auto mt-10 pb-2 custom-scrollbar">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="min-w-[140px] bg-slate-50 p-4 rounded-[2rem] border border-slate-100 flex flex-col items-center group relative"
                >
                  <div className="h-16 w-16 rounded-2xl overflow-hidden mb-3 shadow-md bg-white">
                    <img
                      src={cat.thumbnail?.url}
                      className="h-full w-full object-cover"
                      alt={cat.name}
                    />
                  </div>
                  <span className="text-[10px] font-black text-slate-800 uppercase text-center leading-tight">
                    {cat.name}
                  </span>

                  <div className="absolute inset-0 bg-indigo-600/90 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                    <button
                      onClick={() => editCategory(cat)}
                      className="p-2 bg-white rounded-full text-indigo-600 hover:scale-110 transition-transform"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => deleteCategory(cat._id)}
                      className="p-2 bg-white rounded-full text-red-500 hover:scale-110 transition-transform"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* PRODUCT LISTING GRID */}
          <section>
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
              <div>
                <h3 className="text-3xl font-black tracking-tight">
                  Active Inventory
                </h3>
                <p className="text-slate-400 font-medium text-sm">
                  Manage your listed products and their availability
                </p>
              </div>
              <div className="relative w-full md:w-80">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  className="w-full pl-12 pr-6 py-4 bg-white rounded-2xl border-none shadow-sm focus:ring-4 focus:ring-indigo-500/5 outline-none font-bold"
                  placeholder="Search catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {fetching ? (
              <div className="h-80 flex flex-col items-center justify-center bg-white rounded-[3rem] border border-slate-100">
                <Loader2
                  className="animate-spin text-indigo-600 mb-4"
                  size={40}
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Fetching Database...
                </span>
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredItems.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white p-5 rounded-[2.5rem] border border-transparent hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 group relative"
                  >
                    <div className="relative h-56 rounded-[2rem] overflow-hidden bg-slate-50 mb-5">
                      <img
                        src={item.mainImage?.url}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt={item.title}
                      />
                      <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          onClick={() => editProduct(item)}
                          className="p-3 bg-white text-indigo-600 rounded-xl shadow-xl hover:bg-indigo-600 hover:text-white transition-all"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => deleteItem(item._id)}
                          className="p-3 bg-white text-red-500 rounded-xl shadow-xl hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <div className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black text-indigo-600 uppercase tracking-widest shadow-sm">
                          {item.category}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-start px-2">
                      <div className="max-w-[70%]">
                        <h4 className="font-black text-slate-900 text-lg leading-tight mb-1 truncate">
                          {item.title}
                        </h4>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter">
                          Status:{" "}
                          <span
                            className={
                              item.status === "published"
                                ? "text-green-500"
                                : "text-orange-500"
                            }
                          >
                            {item.status}
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="block text-indigo-600 font-black text-2xl">
                          ${item.price}
                        </span>
                        <span className="text-[10px] text-slate-300 font-bold">
                          UID: {item._id.slice(-6)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-80 flex flex-col items-center justify-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                <Package className="text-slate-200 mb-4" size={60} />
                <p className="text-slate-400 font-bold">
                  No products found in this collection
                </p>
              </div>
            )}
          </section>
        </div>

        {/* RIGHT COLUMN: EDITOR FORM */}
        <div className="xl:col-span-5">
          <div className="bg-white rounded-[3.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 sticky top-10 overflow-hidden">
            <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`h-2 w-2 rounded-full animate-pulse ${form._id ? "bg-orange-400" : "bg-green-400"}`}
                  ></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    {form._id ? "Update Mode" : "New Creation"}
                  </span>
                </div>
                <h3 className="text-2xl font-black tracking-tight">
                  {form._id ? "Edit Product" : "Add Product"}
                </h3>
              </div>
              {form._id && (
                <button
                  onClick={resetProductForm}
                  className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:rotate-90 transition-all"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            <form
              onSubmit={handleProductSubmit}
              className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar"
            >
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                    Product Heading
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleProductChange}
                    placeholder="Enter item name..."
                    className="w-full bg-slate-50 p-5 rounded-[1.5rem] outline-none border-2 border-transparent focus:border-indigo-500 font-bold transition-all shadow-inner"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                      Collection
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleProductChange}
                      className="w-full bg-slate-50 p-5 rounded-[1.5rem] outline-none border-2 border-transparent focus:border-indigo-500 font-bold appearance-none transition-all shadow-inner"
                      required
                    >
                      <option value="">Select...</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                      Market Price ($)
                    </label>
                    <div className="relative">
                      <DollarSign
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600"
                        size={18}
                      />
                      <input
                        name="price"
                        type="number"
                        value={form.price}
                        onChange={handleProductChange}
                        className="w-full bg-slate-50 pl-12 pr-5 py-5 rounded-[1.5rem] outline-none border-2 border-transparent focus:border-indigo-500 font-bold transition-all shadow-inner"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Product Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleProductChange}
                  className="w-full bg-slate-50 p-5 rounded-[1.5rem] outline-none border-2 border-transparent focus:border-indigo-500 font-medium h-32 resize-none transition-all shadow-inner"
                  placeholder="Describe the aesthetic and specs..."
                />
              </div>

              {/* Main Image Upload
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Main Display Asset</label>
                 <div className="relative h-60 w-full rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden transition-all hover:bg-slate-100 group">
                    {mainPreview ? (
                      <div className="relative w-full h-full">
                        <img src={mainPreview} className="h-full w-full object-cover" alt="Main preview" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <Camera className="text-white" size={32} />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                         <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md text-indigo-600">
                            <UploadCloud size={28} />
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Click to upload main image</span>
                      </div>
                    )}
                    <input 
                      type="file" 
                      name="image" 
                      ref={fileInputRef} 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      onChange={handleProductChange}
                    />
                 </div>
              </div> */}

              {/* MULTIPLE GALLERY IMAGES SECTION */}
              <div className="space-y-3">
                {/* <div className="flex justify-between items-center px-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">
                    Product Gallery Assets
                  </label>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                    Max 10 images
                  </span>
                </div> */}

                <div className="grid grid-cols-4 gap-3">
                  {/* Upload Trigger */}
                  {/* <div className="relative aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center hover:bg-indigo-50 hover:border-indigo-200 transition-all cursor-pointer group">
                    <Plus
                      className="text-slate-400 group-hover:text-indigo-600 group-hover:scale-110 transition-all"
                      size={24}
                    />
                    <input
                      type="file"
                      name="gallery"
                      multiple
                      ref={galleryInputRef}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleProductChange}
                    />
                  </div> */}

                  {/* Previews */}
                  {/* {galleryPreviews.map((item, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-2xl overflow-hidden group border border-slate-100 bg-slate-100 shadow-sm animate-in zoom-in duration-300"
                    >
                      <img
                        src={item.url}
                        className="h-full w-full object-cover"
                        alt={`Gallery ${idx}`}
                      />

                    
                      <div
                        className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase text-white shadow-sm ${item.isExisting ? "bg-indigo-500" : "bg-green-500"}`}
                      >
                        {item.isExisting ? "Cloud" : "New"}
                      </div>

                
                      <button
                        type="button"
                        onClick={() => removeGalleryItem(idx, item.isExisting)}
                        className="absolute top-1 right-1 h-6 w-6 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-[-4px] group-hover:translate-y-0 shadow-lg"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))} */}
                </div>
              </div>

              {/* Submit Section */}
              <div className="pt-4 pb-2">
                <button
                  disabled={loading}
                  className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 active:scale-[0.98] transition-all disabled:opacity-50 disabled:translate-y-0"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <Loader2 className="animate-spin" size={20} />
                      <span>Syncing Data...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <CheckCircle2 size={20} />
                      <span>
                        {form._id ? "Commit Changes" : "Publish to Store"}
                      </span>
                    </div>
                  )}
                </button>

                {form._id && (
                  <p className="text-center text-[10px] font-bold text-slate-400 mt-4 uppercase">
                    Updating entry:{" "}
                    <span className="text-slate-600">{form._id}</span>
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* FOOTER INFO */}
      <footer className="mt-20 border-t border-slate-200 pt-10 text-center">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
          Store Admin Panel v4.0.2 &bull; Digital Asset Management Connected
        </p>
      </footer>
    </div>
  );
}
