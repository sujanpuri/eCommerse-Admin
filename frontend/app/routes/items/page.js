// Updated item page with full details and fetched table below
"use client";

import { useUser } from "@/context/userContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Navbar from "@/app/components/navbar";

export default function ItemPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  const [item, setItem] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    quantity: "",
  });

  const [items, setItems] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

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
    setImageFile(e.target.files[0]);
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

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto mt-10 p-6 border rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">Create New Item</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Item Name"
            value={item.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            name="price"
            placeholder="Price"
            type="number"
            value={item.price}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={item.description}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            name="category"
            placeholder="Category"
            value={item.category}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            name="quantity"
            placeholder="Quantity"
            type="number"
            value={item.quantity}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
          <button
            type="submit"
            disabled={uploading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {uploading ? "Uploading..." : "Add Item"}
          </button>
        </form>

        {/* Items Table */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">All Items</h2>
          <table className="w-full border">
            <thead className="bg-gray-100 text-black">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Image</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Sold</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
