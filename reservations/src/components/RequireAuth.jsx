import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";

export default function RequireAuth({ children }) {
  const { user, bootstrapped } = useAuth();
  const location = useLocation();

  if (!bootstrapped) {
    return <div className="container"><div className="card">Loading…</div></div>;
  }
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
