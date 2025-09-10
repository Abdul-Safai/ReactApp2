// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

/** API base (set VITE_API_BASE in .env to override) */
const API_BASE = (import.meta.env.VITE_API_BASE || "/ReactApp2/api").replace(/\/+$/, "");

/** Stable context shape */
const AuthContext = createContext({
  user: null,
  token: "",
  loading: false,   // page-level ops (optional)
  ready: false,     // ← initial session check completed
  setLoading: () => {},
  isAdmin: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refresh: async () => {},
  authFetch: async () => {},
});

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("auth_token") || "");
  const [user, setUser]   = useState(() => {
    try { return JSON.parse(localStorage.getItem("auth_user") || "null"); }
    catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);     // ← new

  // Helper to clear all auth state
  function clearAuth() {
    setToken("");
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  }

  /** Validate session once on mount (if token exists) */
  useEffect(() => {
    let cancelled = false;
    const timeout = setTimeout(() => !cancelled && setReady(true), 7000); // safety: never hang >7s

    (async () => {
      // If no token, we're immediately ready
      if (!token) { setReady(true); return; }

      try {
        const res = await fetch(`${API_BASE}/me.php`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await safeJson(res);
        if (cancelled) return;
        if (res.ok && data?.user) {
          setUser(data.user);
          localStorage.setItem("auth_user", JSON.stringify(data.user));
        } else {
          clearAuth();
        }
      } catch {
        // network error: keep local state; user can still try logging in
      } finally {
        if (!cancelled) setReady(true); // ← signal that initial check is finished
      }
    })();

    return () => { cancelled = true; clearTimeout(timeout); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  /** Cross-tab sync: if you log out in one tab, others follow */
  useEffect(() => {
    function onStorage(e) {
      if (e.key === "auth_token" && !e.newValue) {
        setToken(""); setUser(null);
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  /** ------ API methods ------ */

  // Login: throws Error with { code, lockRemaining } on 423 lockout
  async function login({ email, password }) {
    const res = await fetch(`${API_BASE}/login.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await safeJson(res);
    if (!res.ok) {
      const err = new Error(data?.error || "Login failed");
      err.code = res.status;
      if (res.status === 423 && typeof data?.lock_remaining_seconds === "number") {
        err.lockRemaining = data.lock_remaining_seconds;
      }
      throw err;
    }

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("auth_user", JSON.stringify(data.user));
  }

  // Register: auto-login on success
  async function register({ name, email, password, role, adminCode }) {
    const res = await fetch(`${API_BASE}/register.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role, adminCode }),
    });

    const data = await safeJson(res);
    if (!res.ok) throw new Error(data?.error || "Registration failed");

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("auth_user", JSON.stringify(data.user));
    return data;
  }

  // Logout (best-effort server call; always clear local state)
  async function logout() {
    const t = localStorage.getItem("auth_token");
    try {
      if (t) {
        await fetch(`${API_BASE}/logout.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${t}` },
        });
      }
    } catch { /* ignore */ }
    clearAuth();
  }

  // authFetch: attach bearer automatically; auto-clear on 401
  async function authFetch(input, init = {}) {
    const headers = new Headers(init.headers || {});
    if (token) headers.set("Authorization", `Bearer ${token}`);
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");

    const res = await fetch(input, { ...init, headers });
    if (res.status === 401) clearAuth();
    return res;
  }

  // Manual re-validate current token/user
  async function refresh() {
    if (!token) return null;
    const res = await fetch(`${API_BASE}/me.php`, {
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    });
    const data = await safeJson(res);
    if (res.ok && data?.user) {
      setUser(data.user);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      return data.user;
    }
    clearAuth();
    return null;
  }

  const isAdmin = user?.role === "admin";

  const value = useMemo(() => ({
    user,
    token,
    loading,
    ready,          // ← expose ready flag
    setLoading,
    isAdmin,
    login, register, logout,
    refresh,
    authFetch,
  }), [user, token, loading, ready]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/** Safe JSON helper */
async function safeJson(res) {
  try {
    const text = await res.text();
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}
