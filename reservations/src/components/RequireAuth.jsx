import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";

export default function RequireAuth({ children, role }) {
  const { user, token, ready } = useAuth();
  const loc = useLocation();

  // Wait for initial auth check
  if (!ready) {
    return (
      <div className="container">
        <div className="card">Loading…</div>
      </div>
    );
  }

  // Not signed in → go to login
  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  }

  // Role-gate (optional)
  if (role === "admin" && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
