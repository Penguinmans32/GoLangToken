import { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
  const [tokens, setTokens] = useState({
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
  });

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      setTokens({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      });

      setUser({ username });

      localStorage.setItem('accessToken', data.access_token);
      localStorage.setItem('refreshToken', data.refresh_token);
      setUser({ username });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setTokens({ accessToken: null, refreshToken: null });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  const refreshAccessToken = async () => {
    try {
      const response = await fetch('http://localhost:8080/refresh', {
        method: 'POST',
        headers: {
          'Authorization': tokens.refreshToken,
        },
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      setTokens(prev => ({
        ...prev,
        accessToken: data.access_token,
      }));
      localStorage.setItem('accessToken', data.access_token);
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, tokens, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};