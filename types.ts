
export type Role = 'student' | 'organizer' | 'professional';

export interface BaseProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  photoURL?: string;
  bio: string;
}

export interface StudentProfile extends BaseProfile {
  role: 'student';
  skills: string[];
  interests: string[];
  xp: number;
  level: number;
  badges: string[];
  rating: number;
}

export interface OrganizerProfile extends BaseProfile {
  role: 'organizer';
  organizationName: string;
  location: string;
  website?: string;
  themes?: string[];
}

export interface HiringRequirements {
  requiredSkills: string[];
  domain: string; // Used for domain match
  experienceNeeded: number; // in years or XP equivalent
  duration: string;
  stipend: string;
  location: string;
  projectDescription: string;
  hiringType: 'Intern' | 'Project' | 'Fulltime' | 'Freelance';
}

export interface ProfessionalProfile extends BaseProfile {
  role: 'professional';
  company: string;
  position: string;
  yearsOfExperience: number;
  skills: string[]; // Own skills
  domainExpertise: string[];
  hiringRequirements?: HiringRequirements; // The active requirement for matching
}

export type UserProfile = StudentProfile | OrganizerProfile | ProfessionalProfile;

export interface Hackathon {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  organizerId: string;
  participants: number;
  themes?: string[];
  website?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

export interface MatchResult {
  user: StudentProfile;
  score: number;
}

export type RequestStatus = 'pending' | 'accepted' | 'rejected';

export interface HiringRequest {
  id: string;
  senderId: string;
  senderName: string; // Professional Name
  senderCompany: string;
  receiverId: string; // Student ID
  type: 'Internship' | 'Project' | 'Fulltime' | 'Freelance';
  jobDetails: string;
  status: RequestStatus;
  timestamp: number;
}
