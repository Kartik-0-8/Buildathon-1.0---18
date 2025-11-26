import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, Role } from '../types';

// In a real app, you would import Firebase Auth here
// import { auth, db } from '../services/firebase';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, role: Role) => Promise<void>;
  signup: (email: string, password: string, role: Role, name: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persisted session simulation
    const stored = localStorage.getItem('collabx_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, role: Role) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUser: UserProfile = {
      id: 'current-user',
      name: email.split('@')[0],
      email,
      role, // Dynamically set based on login for demo purposes
      bio: 'Enthusiastic learner ready to build.',
      skills: ['JavaScript', 'React'],
      interests: ['AI', 'Web3'],
      xp: 150,
      level: 1,
      badges: ['Newbie'],
      rating: 1200, // Default start rating
      photoURL: `https://picsum.photos/200?random=${Math.random()}`
    };

    setUser(mockUser);
    localStorage.setItem('collabx_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const signup = async (email: string, password: string, role: Role, name: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: UserProfile = {
      id: 'new-user-' + Date.now(),
      name,
      email,
      role,
      bio: '',
      skills: [],
      interests: [],
      xp: 0,
      level: 1,
      badges: [],
      rating: 1000,
      photoURL: 'https://picsum.photos/200'
    };

    setUser(newUser);
    localStorage.setItem('collabx_user', JSON.stringify(newUser));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('collabx_user');
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Password reset email sent to ${email}`);
    setLoading(false);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (user) {
        const updated = { ...user, ...updates };
        setUser(updated);
        localStorage.setItem('collabx_user', JSON.stringify(updated));
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, resetPassword, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};