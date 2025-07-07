"use client";

import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/app/components/navbar";


// ✅ Register all chart types you use
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

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

  
  // Pie Chart - Items per Category
  const pieData = {
    labels: categoryStats.map((cat) => cat.category),
    datasets: [
      {
        label: 'Items Per Category',
        data: categoryStats.map((cat) => cat.count),
        backgroundColor: ['#6366f1', '#facc15', '#34d399', '#f87171'],
      },
    ],
  };

  // Bar Chart - Sold vs In Stock
  const barData = {
    labels: ['Sold', 'Remaining'],
    datasets: [
      {
        label: 'Inventory Status',
        data: [totalSold, totalQuantity - totalSold],
        backgroundColor: ['#f97316', '#10b981'],
      },
    ],
  };

  // Line Chart - Item Growth (dummy timeline)
  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Total Items Added',
        data: [5, 15, 23, 32, 42, 50],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };


  return (
    <div>
      <Navbar />
      <div className="max-w-6xl text-gray-600 mx-auto mt-10 p-6">
        <h1 className="text-3xl font-bold mb-6">📦 Inventory Analysis</h1>

        {/* Summary Cards */}
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-4 shadow rounded-xl">
            <h2 className="text-lg font-semibold mb-4">Items Per Category</h2>
            <Pie data={pieData} />
          </div>

          <div className="bg-white p-4 shadow rounded-xl">
            <h2 className="text-lg font-semibold mb-4">Sold vs Stock</h2>
            <Bar data={barData} />
          </div>
        </div>

        <div className="bg-white p-4 shadow rounded-xl mb-8">
          <h2 className="text-lg font-semibold mb-4">Item Growth Over Months</h2>
          <Line data={lineData} />
        </div>

        {/* Category Stats Table */}
        <div className="bg-white p-4 shadow rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Items Per Category (Table)</h2>
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
    </div>
  );
}
