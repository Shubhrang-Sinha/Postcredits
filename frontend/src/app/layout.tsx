import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Postcredits",
  description: "Discover your next favorite book or movie",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg-primary text-text-primary font-[family-name:var(--font-family)]">
        <AuthProvider>
          <Header />
          <main className="min-h-[calc(100vh-64px)] flex items-center justify-center">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
