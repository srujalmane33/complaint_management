import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getMe } from "../services/authService";

const AuthContext = createContext(null);

// Decode a JWT payload without verifying signature (client-side only)
const decodeToken = (token) => {
  try {
    const base64Payload = token.split(".")[1];
    const payload = JSON.parse(atob(base64Payload));
    return payload;
  } catch {
    return null;
  }
};

// Check if a decoded token is still valid (not expired)
const isTokenExpired = (decoded) => {
  if (!decoded?.exp) return true;
  return decoded.exp * 1000 < Date.now();
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback((authToken, userData) => {
    const normalizedUser = {
      ...userData,
      role: String(userData.role).toUpperCase(),
    };
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    setToken(authToken);
    setUser(normalizedUser);
  }, []);

  useEffect(() => {
    const verifyUser = async () => {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (!savedToken) {
        setLoading(false);
        return;
      }

      // 1. Decode token client-side first
      const decoded = decodeToken(savedToken);

      // 2. If token is expired — log out immediately
      if (isTokenExpired(decoded)) {
        logout();
        setLoading(false);
        return;
      }

      // 3. If we already have valid user data stored — trust it (avoids logout on refresh)
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed?.role) {
            setUser({ ...parsed, role: String(parsed.role).toUpperCase() });
            setLoading(false);
            return;
          }
        } catch {
          // fall through to server verification
        }
      }

      // 4. Fallback: verify with server (only when no local user data)
      try {
        const res = await getMe();
        let userData = res.data?.user || res.data || res.user || res;
        if (userData?.role) {
          userData = { ...userData, role: String(userData.role).toUpperCase() };
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }
      } catch {
        logout();
      }

      setLoading(false);
    };

    verifyUser();
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);