"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="border-b border-border-subtle/30 bg-bg-primary/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-black tracking-tight text-accent"
        >
          Postcredits
        </Link>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                href="/"
                className="px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors text-sm font-medium"
              >
                Home
              </Link>
              <Link
                href="/movies"
                className="px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors text-sm font-medium"
              >
                Movies
              </Link>
              <Link
                href="/books"
                className="px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors text-sm font-medium"
              >
                Books
              </Link>
              <Link
                href="/watchlist"
                className="px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors text-sm font-medium"
              >
                Watchlist
              </Link>
              <Link
                href="/stats"
                className="px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors text-sm font-medium"
              >
                Stats
              </Link>
              <span className="text-border-subtle text-sm ml-2 hidden md:inline">
                {user?.email}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 text-danger hover:bg-danger-hover/20 rounded-lg transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors text-sm font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-accent-hover text-[#003914] rounded-full font-bold hover:bg-accent transition-colors text-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
