"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { FiMenu, FiX } from "react-icons/fi";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/routes/about" },
  { name: "Items", href: "/routes/items" },
  { name: "Analysis", href: "/routes/analysis" },
  { name: "Users", href: "/routes/users" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (
        menuOpen &&
        !e.target.closest("#mobileMenu") &&
        !e.target.closest("#menuButton")
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [menuOpen]);

  const handleSignOut = () => {
    const confirmOut = window.confirm("Are you sure you want to sign out?");
    if (confirmOut) signOut();
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-white text-gray-800 w-full shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-xl font-bold">🛒 eCommerse (Admin)</div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`hover:text-blue-600 ${
                  pathname === link.href ? "text-blue-600 font-semibold" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}

            <Link
              href="/routes/profile"
              className={`hover:text-blue-600 ${
                pathname === "/routes/profile" ? "text-blue-600 font-semibold" : ""
              }`}
            >
              Profile
            </Link>

            <button
              onClick={handleSignOut}
              className="text-red-600 hover:text-red-800"
            >
              Sign Out
            </button>
          </div>

          {/* Mobile View */}
          <div className="md:hidden flex items-center gap-4">
            <Link
              href="/routes/profile"
              className={`hover:text-blue-600 ${
                pathname === "/routes/profile" ? "text-blue-600 font-semibold" : ""
              }`}
            >
              Profile
            </Link>
            <button
              id="menuButton"
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-2xl"
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </nav>

      {/* RIGHT-SIDED MENU (Mobile Only) */}
      <div
        id="mobileMenu"
        className={`fixed top-0 right-0 h-full w-64 bg-white text-gray-800 shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="p-6 flex flex-col gap-6 mt-12">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`hover:text-blue-600 text-lg ${
                pathname === link.href ? "text-blue-600 font-semibold" : ""
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          <button
            onClick={handleSignOut}
            className="text-red-600 hover:text-red-800 text-left"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Overlay (click outside to close) */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"></div>
      )}
    </>
  );
}
