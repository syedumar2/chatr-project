import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import AuthContext from "./contexts/auth/AuthContext";

export const ProtectedRoutes = () => {
  const { accessToken, authLoading } = useContext(AuthContext);
  if (authLoading) {
    return <p>Loading...</p>;
  }
  if (!accessToken) {
    return <Navigate to="/signin" />;
  }
  return <Outlet />;
};

export default ProtectedRoutes;
