"use client";

import { signOut } from "next-auth/react";

export default function Navbar() {
  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="flex sticky top-0 left-0 mb-6 justify-between items-center bg-white py-4 shadow-md">
      <h1 className="text-3xl font-bold">Ticket Management</h1>
      <form onSubmit={handleLogout}>
        <button
          type="submit"
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Logout
        </button>
      </form>
    </div>
  );
}
