
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, Role, StudentProfile, OrganizerProfile, ProfessionalProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, role: Role) => Promise<void>;
  signup: (email: string, password: string, role: Role, profileData: any) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('collabx_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, role: Role) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create mock user based on role for demo
    let mockUser: UserProfile;
    const base = {
        id: 'current-user',
        name: email.split('@')[0],
        email,
        bio: 'Welcome to my profile.',
        photoURL: `https://api.dicebear.com/9.x/avataaars/svg?seed=${email}&backgroundColor=c0aede`
    };

    if (role === 'student') {
        mockUser = {
            ...base,
            role: 'student',
            skills: ['JavaScript', 'React'],
            interests: ['AI', 'Web3'],
            xp: 150,
            level: 1,
            badges: ['Newbie'],
            rating: 1200
        };
    } else if (role === 'organizer') {
        mockUser = {
            ...base,
            role: 'organizer',
            organizationName: 'Tech Innovators Inc.',
            location: 'San Francisco, CA',
            themes: ['AI', 'Sustainability']
        };
    } else {
        // Mock Professional Login
        mockUser = {
            ...base,
            role: 'professional',
            company: 'TechCorp',
            position: 'Senior Engineer',
            yearsOfExperience: 8,
            skills: ['System Design', 'Leadership'],
            domainExpertise: ['AI', 'Cloud'],
            hiringRequirements: {
                requiredSkills: ['React', 'Node.js'],
                domain: 'AI',
                experienceNeeded: 2,
                duration: '6 Months',
                stipend: 'Paid',
                location: 'Remote',
                projectDescription: 'Building a new Generative AI Dashboard.',
                hiringType: 'Intern'
            }
        };
    }

    setUser(mockUser);
    localStorage.setItem('collabx_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const signup = async (email: string, password: string, role: Role, profileData: any) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let newUser: UserProfile;
    const base = {
        id: 'new-user-' + Date.now(),
        email,
        photoURL: `https://api.dicebear.com/9.x/avataaars/svg?seed=${email}&backgroundColor=c0aede`,
        name: profileData.name || email.split('@')[0],
        bio: profileData.bio || '',
    };

    if (role === 'student') {
        newUser = {
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
        newUser = {
            ...base,
            role: 'organizer',
            organizationName: profileData.organizationName || '',
            location: profileData.location || '',
            themes: profileData.themes || [],
            website: profileData.website || ''
        } as OrganizerProfile;
    } else {
        // Professional Signup Structure
        newUser = {
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

    // In a real app: await setDoc(doc(db, "users", newUser.id), newUser);
    
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
        // Simplified merge for demo, explicitly casting to UserProfile to resolve union type issues
        const updated = { ...user, ...updates } as UserProfile;
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
