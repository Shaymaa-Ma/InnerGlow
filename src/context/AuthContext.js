import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

 
  const validEmail = "test@example.com";
  const validPassword = "password";
  const validName = "Test User";

  // LOGIN: sets user only if credentials match
  const login = (email, password) => {
    if (email === validEmail && password === validPassword) {
      setUser({ email, name: validName });
      return true;
    }
    return false;
  };

  // SIGNUP: only validates input, does NOT log in
  const signup = (name, email, password) => {
    if (name === validName && email === validEmail && password === validPassword) {
      return true; 
    }
    return false; 
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
