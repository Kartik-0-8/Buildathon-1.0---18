export type Role = 'student' | 'organizer' | 'professional';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  photoURL?: string;
  bio: string;
  skills: string[];
  interests: string[];
  xp: number;
  level: number;
  badges: string[];
  rating: number; // ELO-style competitive rating
}

export interface Hackathon {
  id: string;
  title: string;
  date: string;
  description: string;
  image: string;
  organizerId: string;
  participants: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

export interface MatchResult {
  user: UserProfile;
  score: number;
}