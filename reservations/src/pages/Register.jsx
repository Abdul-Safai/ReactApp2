import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [adminCode, setAdminCode] = useState("");

  const [showPwd, setShowPwd] = useState(false);
  const [showAdminCode, setShowAdminCode] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Start clean
  useEffect(() => {
    setName(""); setEmail(""); setPassword(""); setAdminCode("");
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setErrorMsg(""); setSuccessMsg("");
    setLoading(true);
    try {
      await register({ name, email, password, role, adminCode });
      setSuccessMsg("Your account has been created successfully. Redirecting…");
      setTimeout(() => nav("/", { replace: true }), 1200);
    } catch (e) {
      setErrorMsg(e.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <form className="card auth-card" onSubmit={onSubmit} autoComplete="off">
        <div className="auth-head">
          <h1 className="auth-title">Create an account</h1>
          <p className="auth-subtitle">Book and manage your conservation visits</p>
        </div>

        {successMsg && <div className="notice success" role="status" aria-live="polite">{successMsg}</div>}
        {errorMsg && <div className="notice error" role="alert">{errorMsg}</div>}

        {/* Autofill decoys */}
        <input type="text" name="fake-username" style={{ display: "none" }} autoComplete="username" />
        <input type="password" name="fake-password" style={{ display: "none" }} autoComplete="new-password" />

        <div className="field">
          <label>Full Name</label>
          <input
            name="reg_fullname"
            placeholder="Enter your full name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Email</label>
          <input
            name="reg_email"
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
              name="reg_pass"
              autoComplete="new-password"
              placeholder="Create a password"
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

        <div className="field">
          <label>Role</label>
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin (requires secret)</option>
          </select>
        </div>

        {role === "admin" && (
          <div className="field">
            <label>Admin Secret</label>
            <div className="input-icon">
              <input
                type={showAdminCode ? "text" : "password"}
                name="reg_admin_secret"
                autoComplete="new-password"
                inputMode="text"
                autoCorrect="off"
                autoCapitalize="none"
                placeholder="Enter admin secret"
                value={adminCode}
                onChange={e => setAdminCode(e.target.value)}
              />
              <button
                type="button"
                className="icon-toggle"
                onClick={() => setShowAdminCode(s => !s)}
                aria-label={showAdminCode ? "Hide admin secret" : "Show admin secret"}
                aria-pressed={showAdminCode}
                title={showAdminCode ? "Hide" : "Show"}
              >
                {showAdminCode ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            <small className="helper">Ask the instructor for the current admin code.</small>
          </div>
        )}

        <div className="actions" style={{ marginTop: 6 }}>
          <button className="btn btn-wide" type="submit" disabled={loading}>
            {loading ? "Creating…" : "Create account"}
          </button>
          <Link className="btn ghost" to="/login">Back to login</Link>
        </div>
      </form>
    </div>
  );
}

/* Inline SVG icons */
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
