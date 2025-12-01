
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, Role, StudentProfile, OrganizerProfile, ProfessionalProfile } from '../types';

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

const DB_KEY = 'collabx_users_db';
const SESSION_KEY = 'collabx_user';

// Helper to simulate DB operations
const getDB = (): any[] => {
  const stored = localStorage.getItem(DB_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveDB = (users: any[]) => {
  localStorage.setItem(DB_KEY, JSON.stringify(users));
};

const hashPassword = (pwd: string) => btoa(pwd); // Simple simulation of hashing

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network

    const db = getDB();
    const foundUser = db.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!foundUser) {
      setLoading(false);
      throw new Error("Account not found. Please Sign Up to continue.");
    }

    if (foundUser.password !== hashPassword(password)) {
      setLoading(false);
      throw new Error("Incorrect password. Please try again.");
    }

    // Login Successful
    const userProfile = foundUser.profile;
    setUser(userProfile);
    localStorage.setItem(SESSION_KEY, JSON.stringify(userProfile));
    setLoading(false);
  };

  const signup = async (email: string, password: string, role: Role, profileData: any) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const db = getDB();
    if (db.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        setLoading(false);
        throw new Error("Email already registered. Please login.");
    }

    // Construct User Profile
    const base = {
        id: 'user-' + Date.now(),
        email,
        photoURL: `https://api.dicebear.com/9.x/avataaars/svg?seed=${email}&backgroundColor=c0aede`,
        name: profileData.name || email.split('@')[0],
        bio: profileData.bio || '',
    };

    let newUserProfile: UserProfile;

    if (role === 'student') {
        newUserProfile = {
            ...base,
            role: 'student',
            xp: 0,
            level: 1,
            badges: [],
            rating: 1000,
            skills: profileData.skills || [],
            interests: profileData.interests || []
        } as StudentProfile;
    } else if (role === 'organizer') {
        newUserProfile = {
            ...base,
            role: 'organizer',
            organizationName: profileData.organizationName || '',
            location: profileData.location || '',
            themes: profileData.themes || [],
            website: profileData.website || ''
        } as OrganizerProfile;
    } else {
        newUserProfile = {
            ...base,
            role: 'professional',
            company: profileData.company || '',
            position: profileData.position || '',
            yearsOfExperience: profileData.yearsOfExperience || 0,
            skills: profileData.skills || [],
            domainExpertise: profileData.domainExpertise || [],
            hiringRequirements: profileData.hiringRequirements
        } as ProfessionalProfile;
    }

    // Save to Mock DB
    const newUserRecord = {
        email,
        password: hashPassword(password),
        profile: newUserProfile
    };

    db.push(newUserRecord);
    saveDB(db);

    // Auto Login
    setUser(newUserProfile);
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUserProfile));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const db = getDB();
    const userIndex = db.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

    if (userIndex === -1) {
        setLoading(false);
        throw new Error("Email not registered.");
    }

    // Generate Mock OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[MOCK EMAIL] OTP for ${email} is ${otp}`);
    
    db[userIndex].otp = otp;
    saveDB(db);

    setLoading(false);
    // Returning successfully implies OTP sent
  };

  const confirmPasswordReset = async (email: string, otp: string, newPassword: string) => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const db = getDB();
      const userIndex = db.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

      if (userIndex === -1) {
          setLoading(false);
          throw new Error("User not found.");
      }

      const userRecord = db[userIndex];
      
      // Verify OTP (In a real app, check expiry too)
      if (userRecord.otp !== otp) {
          setLoading(false);
          throw new Error("Invalid OTP.");
      }

      // Update Password
      userRecord.password = hashPassword(newPassword);
      delete userRecord.otp;
      
      db[userIndex] = userRecord;
      saveDB(db);
      
      setLoading(false);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (user) {
        const updated = { ...user, ...updates } as UserProfile;
        setUser(updated);
        localStorage.setItem(SESSION_KEY, JSON.stringify(updated));

        // Sync with DB
        const db = getDB();
        const idx = db.findIndex(u => u.email === user.email);
        if (idx !== -1) {
            db[idx].profile = updated;
            saveDB(db);
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
