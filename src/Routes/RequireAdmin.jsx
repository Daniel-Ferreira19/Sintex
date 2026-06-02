import { Navigate, useLocation } from "react-router-dom";

export default function RequireAdmin({ children }) {
  const location = useLocation();
  const role = typeof window !== "undefined" ? localStorage.getItem("userRole") : null;

  if (role === "admin") {
    return children;
  }

  // Redirect to login and keep the attempted location for post-login redirect
  return <Navigate to="/login" state={{ from: location }} replace />;
}
