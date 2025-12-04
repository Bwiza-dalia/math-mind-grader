import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: Record<UserRole, User> = {
  professor: {
    id: 'prof-1',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@university.edu',
    role: 'professor',
    createdAt: new Date('2023-01-15'),
  },
  student: {
    id: 'student-1',
    name: 'Alex Johnson',
    email: 'alex.johnson@university.edu',
    role: 'student',
    createdAt: new Date('2023-09-01'),
  },
  admin: {
    id: 'admin-1',
    name: 'System Admin',
    email: 'admin@university.edu',
    role: 'admin',
    createdAt: new Date('2022-01-01'),
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string, role: UserRole) => {
    // Mock login - in real app, validate credentials
    setUser(mockUsers[role]);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}