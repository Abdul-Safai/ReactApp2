import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // lock countdown (in seconds)
  const [lockRemaining, setLockRemaining] = useState(0);

  // pick up existing lock across refresh (from localStorage)
  useEffect(() => {
    const until = parseInt(localStorage.getItem("authLockUntil") || "0", 10);
    const now = Date.now();
    if (until > now) {
      setLockRemaining(Math.ceil((until - now) / 1000));
    } else {
      localStorage.removeItem("authLockUntil");
    }
  }, []);

  // tick down every second
  useEffect(() => {
    if (lockRemaining <= 0) return;
    const id = setInterval(() => {
      setLockRemaining((s) => {
        if (s <= 1) {
          localStorage.removeItem("authLockUntil");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [lockRemaining]);

  useEffect(() => { setEmail(""); setPassword(""); }, []);

  function formatMMSS(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (lockRemaining > 0) return; // guard
    setErrorMsg("");
    setLoading(true);
    try {
      await login({ email, password });
      const dest = loc.state?.from || "/";
      nav(dest, { replace: true });
    } catch (e) {
      if (e.code === 423) {
        const secs = Math.max(1, Number(e.lockRemaining || 0));
        setLockRemaining(secs);
        localStorage.setItem("authLockUntil", String(Date.now() + secs * 1000));
        setErrorMsg("Your account is temporarily locked. Please try again later.");
      } else {
        setErrorMsg(e.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  }

  const disabled = loading || lockRemaining > 0;

  return (
    <div className="container">
      <form className="card auth-card" onSubmit={onSubmit} autoComplete="off">
        <div className="auth-head">
          <h1 className="auth-title">Sign in to your account</h1>
          <p className="auth-subtitle">Use your email and password to continue</p>
        </div>

        {errorMsg && <div className="notice error" role="alert">{errorMsg}</div>}
        {lockRemaining > 0 && (
          <div className="notice" style={{background:'#fff7ed', borderColor:'#fdba74', color:'#9a3412'}}>
            Locked due to multiple unsuccessful attempts. Try again in <b>{formatMMSS(lockRemaining)}</b>.
          </div>
        )}

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
            disabled={disabled}
          />
        </div>

        <div className="field">
          <label>Password</label>
          <input
            type="password"
            name="login_pass"
            placeholder="Enter your password"
            autoComplete="new-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={disabled}
          />
        </div>

        <div className="actions" style={{ marginTop: 6 }}>
          {/* Button text no longer shows the timer — just “Login” (or “Signing in…”) */}
          <button className="btn btn-wide" type="submit" disabled={disabled}>
            {loading ? "Signing in…" : "Login"}
          </button>
          <Link className="btn ghost" to="/register">Create account</Link>
        </div>
      </form>
    </div>
  );
}
