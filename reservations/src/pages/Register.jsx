import { useState } from "react";
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

  async function onSubmit(e) {
    e.preventDefault();
    try {
      await register({ name, email, password, role, adminCode });
      nav("/", { replace: true });
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="container">
      <form className="card" onSubmit={onSubmit} style={{ maxWidth: 460, margin: "0 auto" }}>
        <h1 className="title" style={{ marginTop: 0 }}>Register</h1>

        <label>Full Name</label>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Alex Doe" />

        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />

        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />

        <label>Role</label>
        <select value={role} onChange={e=>setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin (requires secret)</option>
        </select>

        {role === "admin" && (
          <>
            <label>Admin Secret</label>
            <input value={adminCode} onChange={e=>setAdminCode(e.target.value)} placeholder="Enter admin secret" />
          </>
        )}

        <div style={{ display:"flex", gap:10, marginTop:12 }}>
          <button className="btn" type="submit">Create account</button>
          <Link className="btn ghost" to="/login">Back to login</Link>
        </div>
      </form>
    </div>
  );
}
