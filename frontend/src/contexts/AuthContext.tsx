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
  // Using real leader from database - Sashi (L5 Director) 
  // In a real app, this would come from actual authentication
  const [user, setUser] = useState<User | null>({
    id: 'EMP0023',
    name: 'Sashi',
    email: 'sashi@deutschetelekom.com',
    role: 'leader',
    department: 'OneMind', // Using actual team name from database
    empId: 'EMP0023', // Real employee ID from database
    managerId: 'EMP0023', // Self-reference for hierarchy purposes
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
      // Switch to different personas based on role
      let newUser: User;
      
      switch (role) {
        case 'hr':
          newUser = {
            id: 'HR001',
            name: 'HR Analytics',
            email: 'hr.analytics@deutschetelekom.com',
            role: 'hr',
            department: 'Human Resources',
            empId: 'HR001',
            managerId: 'HR001',
            designation: 'HR Analytics Manager',
            level: 'L5'
          };
          break;
          
        case 'manager':
          newUser = {
            id: 'EMP0001',
            name: 'Sunita Ghosh',
            email: 'sunita.ghosh@deutschetelekom.com',
            role: 'manager',
            department: 'OneAI',
            empId: 'EMP0001',
            managerId: 'EMP0001',
            designation: 'Senior Director',
            level: 'L5'
          };
          break;
          
        case 'leader':
          newUser = {
            id: 'EMP0023',
            name: 'Sashi',
            email: 'sashi@deutschetelekom.com',
            role: 'leader',
            department: 'OneMind',
            empId: 'EMP0023',
            managerId: 'EMP0023',
            designation: 'Director',
            level: 'L5'
          };
          break;
          
        default:
          newUser = { ...user, role };
      }
      
      setUser(newUser);
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