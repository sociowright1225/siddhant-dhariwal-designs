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
} from "lucide-react";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // --- NEW STATE FOR FILTER & SORT ---
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

  const loadProducts = async () => {
    try {
      setFetching(true);
      const { data } = await api.get("/products");
      setProducts(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Get unique categories for the filter dropdown
  const categories = useMemo(() => {
    const cats = products.map((p) => p.category).filter(Boolean);
    return ["All", ...new Set(cats)];
  }, [products]);

  // --- FILTER AND SORT LOGIC ---
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          filterCategory === "All" || p.category === filterCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "alphabetical") return a.title.localeCompare(b.title);
        return 0; // Default (newest/as-is from API)
      });
  }, [products, searchQuery, filterCategory, sortBy]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      const file = files[0];
      setForm({ ...form, image: file });
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
      setPreview(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleEdit = (product) => {
    setForm({
      _id: product._id,
      title: product.title,
      category: product.category,
      price: product.price,
      description: product.description || "",
      status: product.status || "published",
      image: null,
    });
    setPreview(product.image?.url || null);
  };

  const resetForm = () => {
    setForm(initialForm);
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("category", form.category);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("status", form.status);
      if (form.image instanceof File) {
        formData.append("image", form.image);
      }
      if (form._id) {
        await api.put(`/products/${form._id}`, formData);
      } else {
        await api.post("/products", formData);
      }
      resetForm();
      loadProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    if (!confirm("Delete this product permanently?")) return;
    try {
      await api.delete(`/products/${id}`);
      loadProducts();
      if (form._id === id) resetForm();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
   <div className="flex flex-col justify-center items-center">
     <div className="max-w-7xl w-full">
        <div className="flex flex-col lg:flex-row pt-30 bg-white gap-6 p-4">
      {/* LEFT SIDE: INVENTORY LIST */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <Package size={20} className="text-indigo-600" />
              Inventory ({filteredProducts.length})
            </h2>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search products..."
                className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-48 md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* FILTER & SORT CONTROLS */}
          <div className="flex flex-wrap gap-3 items-center text-sm border-t border-gray-100 pt-3">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-transparent font-medium text-gray-600 outline-none cursor-pointer hover:text-indigo-600"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <ArrowUpDown size={14} className="text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-medium text-gray-600 outline-none cursor-pointer hover:text-indigo-600"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="alphabetical">A - Z</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {fetching ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Loader2 className="animate-spin mb-2" />
              <p>Syncing data...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {filteredProducts.map((p) => (
                <div
                  key={p._id}
                  className="p-4 flex items-center gap-4 hover:bg-indigo-50/30 transition-colors group"
                >
                  <div className="h-16 w-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                    {p.image?.url ? (
                      <img
                        src={p.image.url}
                        alt={p.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <ImageIcon size={20} className="text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {p.title}
                    </h3>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      {p.category}
                    </p>
                    <p className="text-indigo-600 font-bold mt-1">₹{p.price}</p>
                  </div>
                  <div className="flex gap-1 ">
                    <button
                      onClick={() => handleEdit(p)}
                      className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-white rounded-lg shadow-sm"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => removeProduct(p._id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-white rounded-lg shadow-sm"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 italic">
              No products found
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE: FORM */}
      <div className="w-full lg:w-[400px] bg-white rounded-xl border border-gray-200 shadow-lg flex flex-col overflow-hidden h-fit lg:sticky lg:top-26">
        <div className="p-4 border-b border-gray-100 bg-gray-900 text-white flex justify-between items-center">
          <h2 className="font-bold flex items-center gap-2">
            {form._id ? <Edit3 size={18} /> : <Plus size={18} />}
            {form._id ? "Update Product" : "New Product"}
          </h2>
          {form._id && (
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Product Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border-b border-gray-200 py-2 focus:border-indigo-600 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Category
              </label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border-b border-gray-200 py-2 focus:border-indigo-600 outline-none"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Price (₹)
              </label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                className="w-full border-b border-gray-200 py-2 focus:border-indigo-600 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-100 rounded-md p-2 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Media Preview
            </label>
            <div className="relative group border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-indigo-400 transition-colors cursor-pointer min-h-[160px] flex items-center justify-center bg-gray-50">
              {preview ? (
                <div className="relative h-32 w-full">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-full w-full object-contain rounded-lg"
                    onError={(e) => {
                      e.target.src = "";
                      setPreview(null);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      setForm({ ...form, image: null });
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg z-20"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center py-2 pointer-events-none">
                  <ImageIcon className="text-gray-300 mb-2" size={32} />
                  <span className="text-xs text-gray-500 text-center">
                    Click to upload or
                    <br />
                    drag an image here
                  </span>
                </div>
              )}
              <input
                name="image"
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*"
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 
              ${form._id ? "bg-indigo-600 hover:bg-indigo-700" : "bg-emerald-600 hover:bg-emerald-700"} 
              disabled:opacity-50`}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : form._id ? (
              "Update Product"
            ) : (
              "Save Product"
            )}
          </button>
        </form>
      </div>
    </div>
    </div>
   </div>
  );
}
