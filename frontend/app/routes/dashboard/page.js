"use client";

import Navbar from "@/app/components/navbar";

const dashboard = () => {
  // 🔹 Demo Data
  const stats = [
    { title: "Total Orders", value: 1224 },
    { title: "Total Customers", value: 531 },
    { title: "Total Products", value: 312 },
    { title: "Total Revenue", value: "$98,400" },
  ];

  const topProducts = [
    { name: "Red Sneakers", sales: 120 },
    { name: "Bluetooth Speaker", sales: 105 },
    { name: "Smart Watch", sales: 97 },
  ];

  const lowStock = [
    { name: "USB-C Cable", quantity: 3 },
    { name: "Wireless Mouse", quantity: 5 },
  ];

  const latestOrders = [
    { id: "ORD123", customer: "Sujan", total: "$120", status: "Delivered" },
    { id: "ORD124", customer: "Binayak", total: "$75", status: "Pending" },
    { id: "ORD125", customer: "Yatra", total: "$45", status: "Shipped" },
  ];
  // 🔹 End of Demo Data

  return (
    <div>
      <Navbar />

      <div className="p-6 max-w-screen-xl mx-auto text-black">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 shadow-md text-center border border-gray-100"
            >
              <p className="text-gray-600">{stat.title}</p>
              <h2 className="text-2xl font-bold mt-2">{stat.value}</h2>
            </div>
          ))}
        </div>

        {/* Top & Low Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
            <ul className="space-y-2">
              {topProducts.map((product, i) => (
                <li key={i} className="flex justify-between">
                  <span>{product.name}</span>
                  <span className="font-semibold">{product.sales} sales</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold mb-4">Low Stock Alerts</h3>
            <ul className="space-y-2">
              {lowStock.map((item, i) => (
                <li
                  key={i}
                  className="flex justify-between text-red-500 font-medium"
                >
                  <span>{item.name}</span>
                  <span>{item.quantity} left</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Latest Orders Table */}
        <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Latest Orders</h3>
          <table className="w-full text-left text-sm">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-2">Order ID</th>
                <th className="py-2">Customer</th>
                <th className="py-2">Total</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {latestOrders.map((order, i) => (
                <tr key={i} className="border-b last:border-none">
                  <td className="py-2">{order.id}</td>
                  <td className="py-2">{order.customer}</td>
                  <td className="py-2">{order.total}</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-600"
                          : order.status === "Shipped"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default dashboard;
