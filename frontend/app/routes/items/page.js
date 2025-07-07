// Updated item page with full details and fetched table below
"use client";

import { useEffect, useState, useMemo } from "react";
import { useUser } from "@/context/userContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Navbar from "@/app/components/navbar";

export default function ItemPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState(""); // "", "available", "soldout"

  const { user, loading } = useUser();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); // 👈 preview state
  const [item, setItem] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    quantity: "",
  });

  // Access Control
  useEffect(() => {
    if (loading) return;
    if (!user || (user.role !== "admin" && user.role !== "staff")) {
      alert("Access denied: You do not have permission to create items.");
      router.push("/routes/dashboard");
    } else {
      fetchItems();
    }
  }, [user, loading, router]);

  // Fetch all items
  const fetchItems = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/items`
      );
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch items:", err);
    }
  };

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // 👈 generate preview URL
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return alert("Please select an image.");

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const uploadRes = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/items/upload-image`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const imageUrl = uploadRes.data.url;

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/items/post`,
        {
          ...item,
          quantity: Number(item.quantity),
          image: imageUrl,
        },
        {
          headers: {
            "x-requester-email": user.email,
          },
        }
      );

      alert("Item created!");
      setItem({
        name: "",
        price: "",
        description: "",
        category: "",
        quantity: "",
      });
      setImageFile(null);
      fetchItems();
    } catch (err) {
      console.error(err);
      alert("Failed to create item");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Access Denied</p>;

  // Unique categories for filter dropdown
  const categories = useMemo(() => {
    const cats = new Set(items.map((item) => item.category));
    return Array.from(cats);
  }, [items]);

  // Handle sorting by column
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Apply search, filter, sort
  const filteredItems = useMemo(() => {
    let filtered = items;

    // Filter by search term in name (case insensitive)
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (filterCategory) {
      filtered = filtered.filter((item) => item.category === filterCategory);
    }

    // Filter by status
    if (filterStatus) {
      if (filterStatus === "available")
        filtered = filtered.filter((item) => !item.soldout);
      else if (filterStatus === "soldout")
        filtered = filtered.filter((item) => item.soldout);
    }

    // Sort
    if (sortConfig !== null) {
      filtered = [...filtered].sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        // For dates convert to timestamp
        if (sortConfig.key === "uploadedAt") {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }

        // For name and category, convert to lowercase for alphabetical
        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [items, searchTerm, filterCategory, filterStatus, sortConfig]);

  // For showing arrow up/down on sorted column
  const getSortArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "▲" : "▼";
    }
    return "";
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto mt-10 p-6 border rounded-xl shadow">
        <button
          disabled={showForm}
          onClick={() => setShowForm(true)}
          className={`px-4 py-2 rounded text-white ${
            showForm
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          ➕ Add New Item
        </button>

        {/* Slide down form */}
        <div
          className={`overflow-hidden transition-max-height duration-500 ease-in-out ${
            showForm ? "max-h-fit mt-6" : "max-h-0"
          }`}
        >
          <div className="p-6 bg-white rounded shadow mt-4 border">
            <h1 className="text-2xl font-bold mb-4 text-black">
              Create New Item
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4 text-black">
              <input
                name="name"
                placeholder="Item Name"
                value={item.name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded focus:outline-blue-500"
              />
              <input
                name="price"
                placeholder="Price"
                type="number"
                value={item.price}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded focus:outline-blue-500"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={item.description}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded focus:outline-blue-500"
              />
              <input
                name="category"
                placeholder="Category"
                value={item.category}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded focus:outline-blue-500"
              />
              <input
                name="quantity"
                placeholder="Quantity"
                type="number"
                value={item.quantity}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded focus:outline-blue-500"
              />

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full"
              />
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-40 h-40 object-cover border rounded"
                  />
                </div>
              )}
              {/* File input can be added here if needed */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Add Item
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">All Items</h2>

          {/* Search & Filters */}
          <div className="flex flex-wrap gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border rounded w-48"
            />

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="text-black">
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="" className="text-black">
                All Status
              </option>
              <option value="available" className="text-black">
                Available
              </option>
              <option value="soldout" className="text-black">
                Sold Out
              </option>
            </select>
          </div>

          {/* Table */}
          <table className="w-full border">
            <thead className="bg-gray-100 text-black">
              <tr>
                <th
                  onClick={() => requestSort("name")}
                  className="p-2 border cursor-pointer select-none"
                  title="Sort by Name"
                >
                  Name {getSortArrow("name")}
                </th>
                <th className="p-2 border">Image</th>
                <th
                  onClick={() => requestSort("category")}
                  className="p-2 border cursor-pointer select-none"
                  title="Sort by Category"
                >
                  Category {getSortArrow("category")}
                </th>
                <th
                  onClick={() => requestSort("price")}
                  className="p-2 border cursor-pointer select-none"
                  title="Sort by Price"
                >
                  Price {getSortArrow("price")}
                </th>
                <th
                  onClick={() => requestSort("quantity")}
                  className="p-2 border cursor-pointer select-none"
                  title="Sort by Quantity"
                >
                  Qty {getSortArrow("quantity")}
                </th>
                <th
                  onClick={() => requestSort("soldCount")}
                  className="p-2 border cursor-pointer select-none"
                  title="Sort by Sold Count"
                >
                  Sold {getSortArrow("soldCount")}
                </th>
                <th className="p-2 border">Status</th>
                <th
                  onClick={() => requestSort("uploadedAt")}
                  className="p-2 border cursor-pointer select-none"
                  title="Sort by Upload Date"
                >
                  Uploaded {getSortArrow("uploadedAt")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center p-4 text-gray-500">
                    No items found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item._id}>
                    <td className="p-2 border">{item.name}</td>
                    <td className="p-2 border">
                      <Image
                        src={item.image}
                        width={50}
                        height={50}
                        alt={item.name}
                        className="rounded object-cover"
                      />
                    </td>
                    <td className="p-2 border">{item.category}</td>
                    <td className="p-2 border">${item.price}</td>
                    <td className="p-2 border">{item.quantity}</td>
                    <td className="p-2 border">{item.soldCount}</td>
                    <td className="p-2 border text-sm font-semibold">
                      {item.soldout ? (
                        <span className="text-red-600">Sold Out</span>
                      ) : (
                        <span className="text-green-600">Available</span>
                      )}
                    </td>
                    <td className="p-2 border text-xs">
                      {new Date(item.uploadedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
