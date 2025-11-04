import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await api.get("/auth/me");
        setUser(response.data.data);
      }
    } catch (error) {
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);

    // Redirect based on role
    if (response.data.user.isFirstLogin) {
      navigate("/change-password");
    } else {
      navigate("/dashboard");
    }

    return response.data;
  };

  const logout = async () => {
    await api.get("/auth/logout");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  };

  const forgotPassword = async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  };

  const verifyOTP = async (email, otp) => {
    const response = await api.post("/auth/verify-otp", { email, otp });
    return response.data;
  };

  const resetPassword = async (email, otp, newPassword) => {
    const response = await api.post("/auth/reset-password", { email, otp, newPassword });
    return response.data;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    forgotPassword,
    verifyOTP,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
