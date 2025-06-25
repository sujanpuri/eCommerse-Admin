"use client";
import { useUser } from "@/context/userContext";

export default function ProfilePage() {
  const { user } = useUser();

  if (!user) return <p className="text-center text-gray-500 mt-10">Loading profile...</p>;

  return (
    <div className="min-h-screen text-gray-800 bg-gray-100 py-12 px-4 flex justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Your Profile</h1>
        <div className="flex flex-col items-center">
          <img
            src={user.photo || "/default-avatar.png"}
            alt={user.name}
            className="w-24 h-24 rounded-full border border-gray-300 mb-4"
            onError={(e) => (e.target.src = "/default-avatar.png")}
          />
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
        </div>
      </div>
    </div>
  );
}
