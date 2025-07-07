"use client";

import { useUser } from "@/context/userContext";
import { useState } from "react";
import axios from "axios";
import Navbar from "@/app/components/navbar";
import Image from "next/image";

export default function ProfilePage() {
  const { user, loading } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", photo: "" });
  const [saving, setSaving] = useState(false);

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>User not found.</p>;

  const handleEditClick = () => {
    setFormData({ name: user.name, photo: user.photo });
    setEditMode(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/edit`,
        {
          email: user.email,
          name: formData.name,
          photo: formData.photo,
        }
      );
      alert("Profile updated successfully!");
      location.reload(); // or refresh userContext data
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen text-gray-700 bg-gray-100 py-12 px-4 flex justify-center">
        <div className="bg-white p-6 rounded-2xl shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4 text-center">Your Profile</h1>
          <div className="flex flex-col items-center">
            <Image 
              src={
                editMode ? formData.photo : user.photo || "/default-avatar.png"
              }
              alt="Profile"
              width={96}  
              height={96}
              className="w-24 h-24 rounded-full border border-gray-300 mb-4"
              />

            {editMode ? (
              <>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mb-2 border px-3 py-1 rounded w-full"
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={formData.photo}
                  onChange={(e) =>
                    setFormData({ ...formData, photo: e.target.value })
                  }
                  className="mb-4 border px-3 py-1 rounded w-full"
                  placeholder="Photo URL"
                />
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-600 text-sm">{user.email}</p>
                <p className="mt-2 text-sm">
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
                <button
                  onClick={handleEditClick}
                  className="mt-4 bg-gray-800 text-white px-4 py-2 rounded"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
