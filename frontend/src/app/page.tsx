"use client";

import { useAuth } from "@/lib/auth-context";
import PersonalizedHome from "@/components/home/PersonalizedHome";
import PublicHome from "@/components/home/PublicHome";
import LoadingState from "@/components/common/LoadingState";

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState />;
  }

  return isAuthenticated ? <PersonalizedHome /> : <PublicHome />;
}
