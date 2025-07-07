"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import axios from "axios";
import { useEffect } from "react";

export default function HomePage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    const saveUser = async () => {
      if (session?.user?.email) {
        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/save`,
            {
              name: session.user.name,
              email: session.user.email,
              photo: session.user.image,
            }
          );
        } catch (err) {
          console.error("❌ Error saving user", err);
        }
      }
    };

    saveUser();
  }, [session]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🔐 Gmail Login with NextAuth</h1>

      {session ? (
        <>
          <p>Welcome, {session.user.name}!</p>
          <img src={session.user.image} alt="profile" width={50} />
          <p>Email: {session.user.email}</p>
          <br />
          <button onClick={() => signOut()}>Sign out</button>

          <br />
          <Link
            href="/routes/dashboard"
            className="inline-block mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out text-center"
          >
            Go to Dashboard Page
          </Link>
        </>
      ) : (
        <>
          <p>You are not logged in.</p>

          <Link
            href="/routes/login"
            style={{ marginBottom: "1rem", display: "block" }}
          >
            Go to Login Page
          </Link>

          <button onClick={() => signIn("google")}>Sign in with Gmail</button>
        </>
      )}
    </div>
  );
}
