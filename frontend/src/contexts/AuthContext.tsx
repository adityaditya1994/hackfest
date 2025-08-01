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
  designation?: string;
  level?: string;
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
  // Using real senior employee from database - Sashi (L4 Principal Engineer)
  // In a real app, this would come from actual authentication
  const [user, setUser] = useState<User | null>({
    id: 'EMP0024',
    name: 'Sashi',
    email: 'sashi@deutschetelekom.com',
    role: 'leader',
    department: 'OneAI', // Using actual team name from database
    empId: 'EMP0024', // Real employee ID from database
    managerId: 'EMP0024', // Self-reference for hierarchy purposes
    designation: 'Principal Engineer',
    level: 'L4'
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