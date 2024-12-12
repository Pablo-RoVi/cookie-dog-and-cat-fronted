import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Agent from "../api/agent";

interface AuthContextProps {
  authenticated: boolean;
  userRole: string | null;
  login: (nick_name: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (nick_name: string, password: string) => {
    try {
      const response = await Agent.Auth.login({ Nick_name: nick_name, Password: password });
      localStorage.setItem("nick_name", response.nick_name);
      localStorage.setItem("role", response.roleId);
      setAuthenticated(true);
      setUserRole(response.roleId);
      navigate("/users");
    } catch (err) {
      console.error("Login error:", err);
      throw new Error("Usuario o contraseña incorrectos.");
    }
  };

  const logout = async () => {
    try {
      await Agent.Auth.logout({Nick_name: localStorage.getItem("nick_name")});
      localStorage.removeItem("nick_name");
      localStorage.removeItem("role");
      setAuthenticated(false);
      setUserRole(null);
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const checkAuthStatus = () => {
    const token = localStorage.getItem("nick_name");
    const role = localStorage.getItem("role");
    if (token && role) {
      setAuthenticated(true);
      setUserRole(role);
    } else {
      setAuthenticated(false);
      setUserRole(null);
    }
  };

  return (
    <AuthContext.Provider value={{ authenticated, userRole, login, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};


  