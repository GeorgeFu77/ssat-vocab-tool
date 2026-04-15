"use client";

import { useSession, signOut } from "next-auth/react";

export default function UserHeader() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
        <span className="text-sm text-gray-400">&nbsp;</span>
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
      <span className="text-sm text-gray-400">
        Hey, <span className="text-white font-medium">{session.user.name || session.user.email}</span>
      </span>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="text-sm text-gray-500 hover:text-gray-300 transition"
      >
        Log out
      </button>
    </div>
  );
}
