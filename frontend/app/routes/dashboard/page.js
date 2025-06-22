'use client'

import Navbar from "@/app/components/navbar"

const dashboard = () => {
  return (
    <div>
        <Navbar />

        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="text-gray-700 mb-6">Welcome to your dashboard!</p>
    </div>
  )
}

export default dashboard