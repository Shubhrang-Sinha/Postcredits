"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const success = await register(email, password, displayName);

    if (success) {
      router.push("/");
    } else {
      setError("Registration failed. Email may already be in use.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary" />

      {/* Register Card */}
      <div className="relative w-full max-w-sm">
        <div className="bg-bg-secondary/80 backdrop-blur-xl rounded-2xl border border-border-subtle/30 p-8 shadow-2xl">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tight text-text-primary mb-2">
              Postcredits
            </h1>
            <p className="text-text-secondary text-sm">Create your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-danger/20 border border-danger/30 rounded-lg text-danger text-sm text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-text-secondary text-xs uppercase tracking-widest font-bold mb-2">
                Display Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-bg-primary border border-border-subtle/50 rounded-full text-text-primary placeholder-gray-500 focus:border-accent focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-text-secondary text-xs uppercase tracking-widest font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-bg-primary border border-border-subtle/50 rounded-full text-text-primary placeholder-gray-500 focus:border-accent focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-text-secondary text-xs uppercase tracking-widest font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-bg-primary border border-border-subtle/50 rounded-full text-text-primary placeholder-gray-500 focus:border-accent focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-accent-hover text-[#003914] rounded-full font-bold hover:bg-accent transition-colors disabled:opacity-50"
            >
              {isLoading ? "Creating account..." : "Register"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-text-secondary text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-accent font-bold hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
