import { createContext, useState, useEffect } from "react";
import api from "./axios";
export const AuthContext = createContext();
//context object called AuthContext created and exposed throughout the directory

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  //load token from localStorage on app load
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) setAccessToken(token);
     setAuthLoading(false);
  }, [accessToken]);

  const login = async (email, pwd) => {
    try {
      const res = await api.post("/login", { email, pwd });

      if (res.data.success) {
        localStorage.setItem("accessToken", res.data.accessToken);
        setAccessToken(res.data.accessToken);
        return { success: true, message: res.data.data };
      } else {
        return { success: true, message: res.data.message };
      }
    } catch (error) {
      if (!error.response) {
        return { success: false, message: "No server response" };
      } else if (error.response?.status === 401) {
        return { success: false, message: "Invalid Email or Password" };
      } else {
        return { success: false, message: "Login Failed" };
      }
    }
  };

  const logout = async () => {
    try {
      const res = await api.post("/logout");
      localStorage.removeItem("accessToken");

      setAccessToken(null);
      setUser(null);
      return { success: true, message: res.data.message };
    } catch (error) {
      console.log(error);
      if (!error.response) {
        return { success: false, message: "No server response" };
      } else if (error.response?.status === 500) {
        return { success: false, message: "LogOut failed" };
      } else {
        return { success: false, message: "Logout Failed" };
      }
    }
  };

  const fetchProtectedData = async () => {
    try {
      const res = await api.get("/protected", {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      });
      console.log(res);
       setUser(res.data.data.email);
      return { success: true, userData: res.data.data };
     
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{  accessToken, user, login, logout, fetchProtectedData, authLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
