import { createContext, useContext, useState, useEffect } from "react";
import * as authAPI from "@/features/auth/api/auth.api";

const AuthContext = createContext();

const clearLocalStorage = () => {
  localStorage.removeItem('auth-token');
  localStorage.removeItem('user');
  localStorage.removeItem('todayWorks');
  localStorage.removeItem('selectedWorks');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      
      if (!response.success && response.message) {
        throw { message: response.message };
      }
      
      const userData = response.data?.user;
      const token = response.data?.token;
      
      if (!userData || !token) {
        throw { message: "유효하지 않은 로그인 응답" };
      }
  
      localStorage.setItem("auth-token", token);
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      clearLocalStorage();
    } catch (error) {
      console.error("Logout failed:", error);
      setUser(null);
      clearLocalStorage();
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
