"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/app/components/navbar";

export default function AnalysisPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/items`
        );
        setItems(res.data);
      } catch (err) {
        console.error("Failed to fetch items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const totalItems = items.length;
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalSold = items.reduce((sum, item) => sum + item.soldCount, 0);
  const soldOutCount = items.filter((item) => item.soldout).length;
  const categories = Array.from(new Set(items.map((item) => item.category)));

  const categoryStats = categories.map((category) => {
    const categoryItems = items.filter((item) => item.category === category);
    return {
      category,
      count: categoryItems.length,
    };
  });

  if (loading) return <p className="p-4">Loading analysis...</p>;

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl text-gray-600 mx-auto mt-10 p-6">
        <h1 className="text-2xl font-bold mb-6">Inventory Analysis</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 shadow rounded-xl">
            <p className="text-gray-500 text-sm">Total Items</p>
            <p className="text-xl font-bold">{totalItems}</p>
          </div>
          <div className="bg-white p-4 shadow rounded-xl">
            <p className="text-gray-500 text-sm">Total Quantity</p>
            <p className="text-xl font-bold">{totalQuantity}</p>
          </div>
          <div className="bg-white p-4 shadow rounded-xl">
            <p className="text-gray-500 text-sm">Total Sold</p>
            <p className="text-xl font-bold">{totalSold}</p>
          </div>
          <div className="bg-white p-4 shadow rounded-xl">
            <p className="text-gray-500 text-sm">Sold Out Items</p>
            <p className="text-xl font-bold">{soldOutCount}</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Items Per Category</h2>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Item Count</th>
            </tr>
          </thead>
          <tbody>
            {categoryStats.map((cat) => (
              <tr key={cat.category}>
                <td className="p-2 border">{cat.category}</td>
                <td className="p-2 border">{cat.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
