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
}

const initialValue: AuthContextProps = {
  authenticated: false,
  setAuthenticated: () => {},
  userRoleId: null,
  setUserRoleId: () => {},
  userNickName: null,
  setUserNickName: () => {},
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
    const roleId = parseInt(localStorage.getItem("roleId"));
    if (nickName && roleId) {
      setAuthenticated(true);
      setUserRoleId(Number(roleId));
      setUserNickName(nickName);
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
