"use client";

import { useUser } from "@/context/userContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ItemPage() {
  const { user, loading } = useUser(); // 👈 get user and loading from context
  const router = useRouter();

  const [item, setItem] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
  });

  useEffect(() => {
    if (loading) return; // wait for context to load

    if (!user || (user.role !== "admin" && user.role !== "staff")) {
      alert("Access denied: You do not have permission to create items.");
      router.push("/routes/dashboard"); // 🚫 redirect if not authorized
    }
  }, [user, loading, router]);

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/items/post`,
        item,
        {
          headers: {
            "x-requester-email": user.email, // 👈 use email from context
          },
        }
      );

      alert("Item Created!");
      setItem({ name: "", price: "", image: "", description: "" });
    } catch (err) {
      console.error(err);
      alert("Error creating item");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Access denied</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-xl shadow">
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
          className="w-full p-2 border rounded"
        />
        <input
          name="image"
          placeholder="Image URL"
          value={item.image}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={item.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Item
        </button>
      </form>
    </div>
  );
}
