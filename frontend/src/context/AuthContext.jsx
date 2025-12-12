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
  const [permissions, setPermissions] = useState([]);
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

        // Fetch permissions if user is admin
        if (response.data.data.role === 'admin') {
          try {
            const permResponse = await api.get("/user/permissions");
            setPermissions(permResponse.data.data.permissions || []);
          } catch (err) {
            console.error("Failed to fetch permissions", err);
            setPermissions([]);
          }
        } else {
          // For non-admins, permissions might not be relevant or handled differently
          // For superadmin/developer, we might want to assume full permissions or handle it in UI
          setPermissions([]);
        }
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

    if (response.data.user.role === 'admin') {
      try {
        // We need to fetch permissions here too to have them immediately
        const permResponse = await api.get("/user/permissions");
        setPermissions(permResponse.data.data.permissions || []);
      } catch (err) {
        console.error("Failed to fetch permissions on login", err);
        setPermissions([]);
      }
    } else {
      setPermissions([]);
    }

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
    setPermissions([]);
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

  const hasPermission = (permission) => {
    // Superadmin and Developer have all permissions effectively
    if (user?.role === 'superadmin' || user?.role === 'developer') return true;
    if (user?.role !== 'admin') return false; // Default for others unless specified

    // The Twist: Volunteer management implies Task management
    if (permission === 'manage_task_assignment' && (permissions.includes('manage_volunteers') || permissions.includes('manage_task_assignment'))) {
      return true;
    }

    return permissions.includes(permission);
  };

  const value = {
    user,
    permissions,
    hasPermission,
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
