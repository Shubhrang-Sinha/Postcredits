import type { Metadata } from "next";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
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
      <body className="min-h-screen bg-[#191111] text-white">
        <AuthProvider>
          <Theme accentColor="cyan" grayColor="sand" radius="medium">
            <Header />
            {children}
          </Theme>
        </AuthProvider>
      </body>
    </html>
  );
}
