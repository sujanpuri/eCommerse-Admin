// app/about/page.js
import Navbar from "@/app/components/navbar";
import React from "react";

export default function AboutPage() {
  return (
    <div>
      <Navbar />
      {/* About Section */}
      <div className="max-w-4xl text-gray-50 mx-auto px-4 py-10 space-y-16">
        <section>
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-lg text-gray-300">
            Welcome to <strong>eCommerce (Admin)</strong> — your intelligent
            eCommerce platform designed to help admins manage inventory smartly
            and offer users a seamless shopping experience.
          </p>
          <p className="mt-4 text-gray-300">
            Our mission is to combine AI with commerce, making product
            management easier, tracking stock efficiently, and providing trend
            insights. Built with modern technologies like Next.js, Express, and
            MongoDB, we ensure performance, scalability, and a great user
            experience.
          </p>
        </section>

        {/* Contact Section */}
        <section>
          <h2 className="text-3xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-300 mb-6">
            Have questions, feedback, or need support? We’re here to help!
          </p>

          <div className="space-y-2 text-gray-300">
            <p>
              <strong>Email:</strong> support@shopsmart.com
            </p>
            <p>
              <strong>Phone:</strong> +977-9800000000
            </p>
            <p>
              <strong>Address:</strong> Kathmandu, Nepal
            </p>
          </div>

          {/* Optional: Contact form for user message */}
          <form className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Your Name
              </label>
              <input
                type="text"
                className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Your Email
              </label>
              <input
                type="email"
                className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Message
              </label>
              <textarea
                rows="4"
                className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
