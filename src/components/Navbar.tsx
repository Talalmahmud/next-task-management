"use client";

import { signOut } from "next-auth/react";

export default function Navbar() {
  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="flex mb-6 justify-between items-center">
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
