
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, Role } from '../types';
import { authService, fetchStudents } from '../services/data';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role: Role, profileData: any) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  confirmPasswordReset: (email: string, otp: string, newPassword: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'collabx_active_session_user_id';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on load
  useEffect(() => {
    const restoreSession = async () => {
        try {
            const userId = localStorage.getItem(SESSION_KEY);
            if (userId) {
                // Fetch fresh user data from DB using the ID, instead of relying on stale session data
                const allUsers = await fetchStudents();
                const freshUser = allUsers.find(u => u.id === userId);
                if (freshUser) {
                    setUser(freshUser);
                } else {
                    localStorage.removeItem(SESSION_KEY); // User might have been deleted from DB (unlikely)
                }
            }
        } catch (e) {
            console.error("Session restore failed", e);
        } finally {
            setLoading(false);
        }
    };
    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
        const loggedInUser = await authService.login(email, password);
        setUser(loggedInUser);
        localStorage.setItem(SESSION_KEY, loggedInUser.id);
    } finally {
        setLoading(false);
    }
  };

  const signup = async (email: string, password: string, role: Role, profileData: any) => {
    setLoading(true);
    try {
        const newUser = await authService.signup(email, password, role, profileData);
        setUser(newUser);
        localStorage.setItem(SESSION_KEY, newUser.id);
    } finally {
        setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
        await authService.resetPassword(email);
    } finally {
        setLoading(false);
    }
  };

  const confirmPasswordReset = async (email: string, otp: string, newPassword: string) => {
      setLoading(true);
      try {
          await authService.confirmPasswordReset(email, otp, newPassword);
      } finally {
          setLoading(false);
      }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (user) {
        const updated = authService.updateProfile(user.id, updates);
        if (updated) {
            setUser(updated);
        }
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, resetPassword, confirmPasswordReset, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
