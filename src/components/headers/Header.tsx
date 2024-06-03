"use client";

import { signOut } from "next-auth/react";

export default function Header({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <header className="flex flex-row justify-between items-center h-12 sm:h-16 px-3 sm:px-6 py-4 border-b border-b-slate-300">
      {children}
      <div className="flex flex-row items-center gap-2 sm:gap-4 ml-6">
        <button
          onClick={() => signOut()}
          className="border border-slate-300 rounded h-9 px-2 sm:px-3 text-xs sm:text-sm"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
