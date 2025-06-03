import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import AuthContext from "./contexts/auth/AuthContext";
import Layout from "@/components/Layout";


export const ProtectedRoutes = () => {
  const { accessToken, authLoading } = useContext(AuthContext);
  if (authLoading) {
    return <p>Loading...</p>;
  }
  if (!accessToken) {
    return <Navigate to="/signin" />;
  }
  return <Layout> <Outlet /></Layout>;
};

export default ProtectedRoutes;
