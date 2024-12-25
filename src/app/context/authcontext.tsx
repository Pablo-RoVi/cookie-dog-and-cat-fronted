import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Agent from "../api/agent";

interface AuthContextProps {
  authenticated: boolean;
  userRoleId: number | null;
  userNickName: string | null;
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
  const [userRoleId, setUserRoleId] = useState<number | null>(null);
  const [userNickName, setUserNickName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (nick_name: string, password: string) => {
    try {
      const response = await Agent.Auth.login({ Nick_name: nick_name, Password: password });
      localStorage.setItem("nick_name", response.data.nick_name);
      localStorage.setItem("roleId", response.data.roleId);
      setAuthenticated(true);
      setUserRoleId(response.data.roleId);
      setUserNickName(response.data.nick_name);
      navigate("/users");
    } catch (err) {
      console.error("Login error:", err);
      throw new Error("Usuario o contraseña incorrectos.");
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem("nick_name");
      localStorage.removeItem("roleId");
      setAuthenticated(false);
      setUserRoleId(null);
      setUserNickName(null);
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const checkAuthStatus = () => {
    const nickName = localStorage.getItem("nick_name");
    const roleId = parseInt(localStorage.getItem("roleId"));
    if (nickName && roleId) {
      setAuthenticated(true);
      setUserRoleId(roleId);
      setUserNickName(nickName);
    } else {
      setAuthenticated(false);
      setUserRoleId(null);
      setUserNickName(null);
    }
  };

  return (
    <AuthContext.Provider value={{ authenticated, userNickName, userRoleId, login, logout, checkAuthStatus }}>
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


  