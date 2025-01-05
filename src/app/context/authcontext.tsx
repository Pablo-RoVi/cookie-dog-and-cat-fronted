import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";

interface AuthContextProps {
  authenticated: boolean;
  setAuthenticated: (newState: boolean) => void;
  userRoleId: number | null;
  setUserRoleId: (newState: number) => void;
  userNickName: string | null;
  setUserNickName: (newState: string) => void;
  logout: () => void;
}

const initialValue: AuthContextProps = {
  authenticated: false,
  setAuthenticated: () => {},
  userRoleId: null,
  setUserRoleId: () => {},
  userNickName: null,
  setUserNickName: () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextProps>(initialValue);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(
    initialValue.authenticated
  );
  const [userRoleId, setUserRoleId] = useState<number | undefined>(
    initialValue.userRoleId
  );
  const [userNickName, setUserNickName] = useState<string | undefined>(
    initialValue.userNickName
  );

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const nickName = localStorage.getItem("nickName");
    const roleId = localStorage.getItem("roleId");

    if (nickName && roleId && !isNaN(Number(roleId))) {
      setAuthenticated(true);
      setUserRoleId(Number(roleId));
      setUserNickName(nickName);
    } else {
      setAuthenticated(false);
      setUserRoleId(null);
      setUserNickName(null);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem("nickName");
      localStorage.removeItem("roleId");
      setAuthenticated(false);
      setUserRoleId(null);
      setUserNickName(null);
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        setAuthenticated,
        userNickName,
        setUserNickName,
        userRoleId,
        setUserRoleId,
        logout,
      }}
    >
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
