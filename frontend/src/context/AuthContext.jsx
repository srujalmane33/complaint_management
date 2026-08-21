import { createContext, useContext, useState, useEffect } from "react";
import { getMe } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        try {
          const res = await getMe();
          let userData = res.data?.user || res.data || res.user || res;
          if (userData && userData.role) {
            userData = { ...userData, role: String(userData.role).toUpperCase() };
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
          }
        } catch {
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = (authToken, userData) => {
    const normalizedUser = {
      ...userData,
      role: String(userData.role).toUpperCase(),
    };
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    setToken(authToken);
    setUser(normalizedUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);