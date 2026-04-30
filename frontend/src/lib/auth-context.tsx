"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "./api";

interface User {
  userId: number;
  email: string;
  displayName?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const result = await api.post<{
      token: string;
      userId: number;
      displayName?: string;
    }>("/auth/login", { email, password });

    if (result.data && result.data.token) {
      const { token, userId, displayName } = result.data;
      localStorage.setItem("auth_token", token);
      localStorage.setItem(
        "auth_user",
        JSON.stringify({ userId, email, displayName }),
      );
      setToken(token);
      setUser({ userId, email, displayName });
      return true;
    }
    return false;
  };

  const register = async (
    email: string,
    password: string,
    displayName: string,
  ): Promise<boolean> => {
    const result = await api.post<{ token: string; userId: number }>(
      "/auth/register",
      { email, password, displayName },
    );

    if (result.data && result.data.token) {
      const { token, userId } = result.data;
      localStorage.setItem("auth_token", token);
      localStorage.setItem(
        "auth_user",
        JSON.stringify({ userId, email, displayName }),
      );
      setToken(token);
      setUser({ userId, email, displayName });
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
