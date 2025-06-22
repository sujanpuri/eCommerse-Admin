"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (session) {
      router.push("/routes/dashboard");
    }
  }, [session, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center text-gray-800 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-2">🔐 Sign In</h1>
        <p className="text-gray-600 mb-6">Sign in with your Gmail account</p>

        <button
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-3 py-2 px-4 border border-gray-300 rounded-md shadow hover:bg-gray-50 transition"
        >
          <FcGoogle size={22} />
          <span className="font-medium">Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}
