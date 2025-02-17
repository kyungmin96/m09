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
      const userData = response.data?.user;
      
      console.log("[userData 정보]: ", userData);

      if (response.data?.token) {
        localStorage.setItem("auth-token", response.data.token);
      }

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
      // 로그아웃 실패시에도 로컬 상태는 초기화
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
