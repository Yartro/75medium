import { createContext, useEffect, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import { getAuth, setAuth, subscribeAuth, type StoredAuth } from "./tokenStore";

interface AuthContextValue {
  auth: StoredAuth | null;
  login: (code: string) => Promise<void>;
  logout: () => void;
  loginError: string | null;
  isLoggingIn: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuthState] = useState<StoredAuth | null>(getAuth());
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => subscribeAuth(setAuthState), []);

  const login = async (code: string) => {
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      const result = await api.login(code);
      setAuth({ token: result.token, userId: result.userId, name: result.name });
    } catch {
      setLoginError("Onjuiste code. Probeer het opnieuw.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = () => {
    setAuth(null);
    queryClient.clear();
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, loginError, isLoggingIn }}>
      {children}
    </AuthContext.Provider>
  );
}
