import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Ensure fields are cleared on each mount (page refresh)
  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    try {
      await login({ email, password });
      const dest = loc.state?.from || "/";
      nav(dest, { replace: true });
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="container">
      {/* autocomplete off to fight browser autofill */}
      <form
        className="card"
        onSubmit={onSubmit}
        style={{ maxWidth: 420, margin: "0 auto" }}
        autoComplete="off"
      >
        <h1 className="title" style={{ marginTop: 0 }}>Login</h1>

        {/* Decoy fields to absorb autofill in Chrome/Safari */}
        <input type="text" name="fake-username" style={{ display: "none" }} autoComplete="username" />
        <input type="password" name="fake-password" style={{ display: "none" }} autoComplete="new-password" />

        <label>Email</label>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="off"
          name="login_email"              // non-standard name avoids autofill
          inputMode="email"
          autoCorrect="off"
          autoCapitalize="none"
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="new-password"     // prevents managers from auto-filling saved passwords
          name="login_pass"               // non-standard name avoids autofill
        />

        <div style={{ display:"flex", gap:10, marginTop:12 }}>
          <button className="btn" type="submit">Login</button>
          <Link className="btn ghost" to="/register">Create account</Link>
        </div>
      </form>
    </div>
  );
}
