const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const TOKEN_KEY = "ra2_token";
const USER_KEY  = "ra2_user";

function getToken() { return localStorage.getItem(TOKEN_KEY); }
function setSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}
export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
export function currentUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

// Robust parser to avoid "Unexpected end of JSON input"
async function parseJsonOrThrow(res) {
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch {}
  if (!res.ok) {
    const msg = data?.error || `HTTP ${res.status} ${res.statusText}${text ? " – "+text : ""}`;
    throw new Error(msg);
  }
  if (data == null) throw new Error(`Empty response (HTTP ${res.status}) from ${res.url}`);
  return data;
}

export async function register(payload) {
  const res = await fetch(`${API_BASE}/register.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await parseJsonOrThrow(res);
  setSession(data.token, data.user);
  return data.user;
}

export async function login(payload) {
  const res = await fetch(`${API_BASE}/login.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await parseJsonOrThrow(res);
  setSession(data.token, data.user);
  return data.user;
}

export async function me() {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${API_BASE}/me.php`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  try {
    const data = await parseJsonOrThrow(res);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data.user;
  } catch {
    clearSession();
    return null;
  }
}

export async function logout() {
  const token = getToken();
  if (token) {
    try {
      await fetch(`${API_BASE}/logout.php`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {}
  }
  clearSession();
}

export function isAdmin(user) { return user?.role === "admin"; }
