import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Always start with empty fields
  useEffect(() => { setEmail(""); setPassword(""); }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      await login({ email, password });
      const dest = loc.state?.from || "/";
      nav(dest, { replace: true });
    } catch (e) {
      setErrorMsg(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <form className="card auth-card" onSubmit={onSubmit} autoComplete="off">
        <div className="auth-head">
          <h1 className="auth-title">Sign in to your account</h1>
          <p className="auth-subtitle">Use your email and password to continue</p>
        </div>

        {errorMsg && <div className="notice error" role="alert">{errorMsg}</div>}

        {/* Autofill decoys */}
        <input type="text" name="fake-username" style={{ display: "none" }} autoComplete="username" />
        <input type="password" name="fake-password" style={{ display: "none" }} autoComplete="new-password" />

        <div className="field">
          <label>Email</label>
          <input
            name="login_email"
            inputMode="email"
            autoCorrect="off"
            autoCapitalize="none"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Password</label>
          <div className="input-icon">
            <input
              type={showPwd ? "text" : "password"}
              name="login_pass"
              placeholder="Enter your password"
              autoComplete="new-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="icon-toggle"
              onClick={() => setShowPwd(s => !s)}
              aria-label={showPwd ? "Hide password" : "Show password"}
              aria-pressed={showPwd}
              title={showPwd ? "Hide" : "Show"}
            >
              {showPwd ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <div className="actions" style={{ marginTop: 6 }}>
          <button className="btn btn-wide" type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Login"}
          </button>
          <Link className="btn ghost" to="/register">Create account</Link>
        </div>
      </form>
    </div>
  );
}

/* Inline SVG icons: eye / eye-off */
function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 1 12 1 12a21.8 21.8 0 0 1 5.06-6.94" />
      <path d="M10.58 10.58a3 3 0 1 0 4.24 4.24" />
      <path d="M12 7a3 3 0 0 1 3 3" />
      <path d="M3 3l18 18" />
    </svg>
  );
}
