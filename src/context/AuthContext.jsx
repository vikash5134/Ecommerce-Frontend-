import { createContext, useState, useContext } from 'react';
import usersData from '../data/users.json';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const initializeUsers = () => {
    const existingUsers = localStorage.getItem('users');
    if (!existingUsers) {
      localStorage.setItem('users', JSON.stringify(usersData));
    }
  };

  useState(() => {
    initializeUsers();
  }, []);

  const register = (username, email, password, address) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find(u => u.username === username)) {
      return { success: false, message: 'Username already exists' };
    }
    
    const newUser = { username, email, password, address, isAdmin: false };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    const userData = { username, email, address, isAdmin: false };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return { success: true };
  };

  const login = (username, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(u => u.username === username && u.password === password);
    
    if (!foundUser) {
      return { success: false, message: 'Invalid username or password' };
    }
    
    const userData = { username: foundUser.username, email: foundUser.email, address: foundUser.address, isAdmin: foundUser.isAdmin };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
