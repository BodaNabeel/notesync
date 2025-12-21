"use client";

import { authClient } from "@/lib/auth-client";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthClientError {
  code?: string;
  message?: string;
  status: number;
  statusText: string;
}

type AuthState = {
  token: string | null;
  loading: boolean;
  error: AuthClientError | null;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<AuthClientError | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchToken = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await authClient.token();

      if (error) {
        setError(error);
        setToken(null);
        return;
      }

      setToken(data.token);
      setError(null);
    } catch (err) {
      setError(err as AuthClientError);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  return (
    <AuthContext.Provider value={{ token, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
