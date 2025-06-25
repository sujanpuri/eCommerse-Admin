"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/userContext";
import axios from "axios";

export default function UserListPage() {
  const [users, setUsers] = useState([]);
  const { user: currentUser } = useUser(); // logged-in user

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`
      );
      const data = await res.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);
const handleRoleChange = async (userId, newRole) => {
  const userToChange = users.find((u) => u._id === userId);
  const confirmChange = window.confirm(
    `Are you sure you want to change ${userToChange.name}'s role to "${newRole}"?`
  );

  if (!confirmChange) return;

  try {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/update-role`,
      { userId, newRole },
      {
        headers: {
          "x-requester-email": currentUser?.email,
        },
      }
    );

    const updatedUser = res.data.user;
    setUsers((prev) =>
      prev.map((u) =>
        u._id === userId ? { ...u, role: updatedUser.role } : u
      )
    );
  } catch (err) {
    alert("Failed to update role: maybe You are not Admin.", err);
    console.error("Failed to update role:", err);
  }
};


  return (
    <div className="min-h-screen text-gray-700 bg-gray-100 py-10 px-4">
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
              <p className="text-sm mt-1 mb-1">
                Role:{" "}
                <span
                  className={`font-semibold ${
                    user.role === "admin"
                      ? "text-green-600"
                      : user.role === "staff"
                      ? "text-blue-600"
                      : "text-purple-600"
                  }`}
                >
                  {user.role}
                </span>
              </p>

              {currentUser?.role === "admin" && (
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  className="text-sm border rounded px-2 py-1 mt-1 bg-gray-50"
                >
                  <option value="admin">admin</option>
                  <option value="staff">staff</option>
                  <option value="user">user</option>
                </select>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
