import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'leader' | 'hr' | 'manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  managerId?: string;
  empId?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // For demo purposes, we'll start with a default user
  // In a real app, this would come from actual authentication
  const [user, setUser] = useState<User | null>({
    id: 'user-001',
    name: 'John Smith',
    email: 'john.smith@deutschetelekom.com',
    role: 'leader', // Back to leader role to test the fix
    department: 'OneAI', // Using actual team name from database
    empId: 'EMP0024' // Using Ananya's ID as example
  });

  const isAuthenticated = user !== null;

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
    switchRole,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 