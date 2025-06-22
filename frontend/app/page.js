"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function HomePage() {
  const { data: session, status } = useSession();

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
