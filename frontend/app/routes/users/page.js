// app/users/page.js
"use client";

import { useEffect, useState } from "react";

export default function UserListPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`
        );
        const data = await res.json();
        setUsers(data);
        // console.log("Fetched users:", data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen text-gray-800 bg-gray-100 py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">User Collection</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white p-4 rounded-2xl shadow-md flex items-center space-x-4"
          >
            <img
              src={user.photo}
              alt={user.name}
              className="w-16 h-16 rounded-full border border-gray-300"
            />
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-600 text-sm">{user.email}</p>
              <p className="text-sm mt-1">
                Role:{" "}
                <span
                  className={`font-semibold ${
                    user.role === "admin"
                      ? "text-green-600"
                      : user.role === "staff"
                      ? "text-blue-600"
                      : "text-purple-600" // for regular user
                  }`}
                >
                  {user.role}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
