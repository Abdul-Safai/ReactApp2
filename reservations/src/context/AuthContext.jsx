import { createContext, useContext, useEffect, useState } from "react";
import {
  currentUser as readCachedUser,
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  me as apiMe,
} from "../lib/auth.js";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [bootstrapped, setBootstrapped] = useState(false);

  // validate token or use cached user on first load
  useEffect(() => {
    (async () => {
      const serverUser = await apiMe().catch(() => null);
      setUser(serverUser ?? readCachedUser());
      setBootstrapped(true);
    })();
  }, []);

  async function login(payload) {
    const u = await apiLogin(payload);
    setUser(u);
    return u;
  }
  async function register(payload) {
    const u = await apiRegister(payload);
    setUser(u);
    return u;
  }
  async function logout() {
    await apiLogout();
    setUser(null);
  }

  return (
    <AuthCtx.Provider value={{ user, login, register, logout, bootstrapped }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
