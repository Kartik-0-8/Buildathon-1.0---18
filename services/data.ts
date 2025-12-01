
import { UserProfile, Hackathon, ChatMessage, StudentProfile, HiringRequest, TeamRequest, Role, Registration } from '../types';

// --- CONSTANTS & CONFIG ---
const DB_VERSION = 'v1';
const STORAGE_KEY = `collabx_persistent_db_${DB_VERSION}`;

// --- INITIAL SEED DATA ---
const SEED_USERS: StudentProfile[] = [
  {
    id: 'u2', name: 'Alice Chen', email: 'alice@example.com', role: 'student',
    photoURL: 'https://picsum.photos/100/100?random=10', bio: 'Full Stack Dev loving React & Node.',
    skills: ['React', 'Node.js', 'TypeScript'], interests: ['FinTech', 'AI'], xp: 450, level: 4, badges: ['Top Coder'], rating: 1450
  } as StudentProfile,
  {
    id: 'u3', name: 'Bob Smith', email: 'bob@example.com', role: 'student',
    photoURL: 'https://picsum.photos/100/100?random=11', bio: 'Data Scientist in training.',
    skills: ['Python', 'PyTorch', 'SQL'], interests: ['AI', 'HealthTech'], xp: 200, level: 2, badges: ['Data Wizard'], rating: 1200
  } as StudentProfile,
  {
    id: 'u4', name: 'Charlie Kim', email: 'charlie@example.com', role: 'student',
    photoURL: 'https://picsum.photos/100/100?random=12', bio: 'UX Designer looking for devs.',
    skills: ['Figma', 'UI/UX', 'CSS'], interests: ['EdTech', 'GreenTech'], xp: 600, level: 6, badges: ['Pixel Perfect'], rating: 1600
  } as StudentProfile,
  {
    id: 'u5', name: 'Diana Prince', email: 'diana@example.com', role: 'student',
    photoURL: 'https://picsum.photos/100/100?random=13', bio: 'Cybersecurity enthusiast.',
    skills: ['Python', 'Network Security', 'Linux'], interests: ['Security', 'FinTech'], xp: 800, level: 8, badges: ['Bug Hunter'], rating: 1850
  } as StudentProfile,
  {
    id: 'u6', name: 'Evan Wright', email: 'evan@example.com', role: 'student',
    photoURL: 'https://picsum.photos/100/100?random=14', bio: 'Mobile Dev (Flutter/iOS).',
    skills: ['Flutter', 'Dart', 'Swift'], interests: ['Social', 'EdTech'], xp: 350, level: 3, badges: ['App Master'], rating: 1320
  } as StudentProfile
];

export const MOCK_HACKATHONS: Hackathon[] = [
  { id: 'h6', title: 'Delhi NCR Innovate', date: 'Nov 29-30', location: 'New Delhi, NCR', description: 'The biggest tech sprint in North India.', image: 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?auto=format&fit=crop&q=80&w=400', organizerId: 'org4', participants: 1500, themes: ['Smart City'], registrations: [] },
  { id: 'h7', title: 'Mumbai FinTech Expo', date: 'Nov 27-28', location: 'Mumbai', description: 'Revolutionizing finance.', image: 'https://images.unsplash.com/photo-1567473030492-533b30c5494c?auto=format&fit=crop&q=80&w=400', organizerId: 'org5', participants: 2100, themes: ['FinTech'], registrations: [] },
  { id: 'h1', title: 'Global AI Challenge', date: 'Dec 09-10', location: 'Online', description: 'Build the future of Generative AI.', image: 'https://picsum.photos/400/200?random=1', organizerId: 'org1', participants: 1240, themes: ['AI'], registrations: [] }
];

// --- DATABASE SCHEMA ---
interface DatabaseSchema {
    users: { email: string; passwordHash: string; profile: UserProfile; otp?: string }[];
    hackathons: Hackathon[];
    teamRequests: TeamRequest[];
    hiringRequests: HiringRequest[];
    chats: ChatMessage[];
}

const INITIAL_DB: DatabaseSchema = {
    users: SEED_USERS.map(p => ({
        email: p.email,
        passwordHash: btoa('password'), // Simple encoding for demo
        profile: p
    })),
    hackathons: MOCK_HACKATHONS,
    teamRequests: [],
    hiringRequests: [],
    chats: []
};

// --- CORE DATABASE ENGINE ---
class Database {
    private data: DatabaseSchema;

    constructor() {
        this.data = this.load();
    }

    private load(): DatabaseSchema {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Ensure existing hackathons have registrations array if migrated
                if (parsed.hackathons) {
                    parsed.hackathons = parsed.hackathons.map((h: Hackathon) => ({
                        ...h,
                        registrations: h.registrations || []
                    }));
                }
                return { ...INITIAL_DB, ...parsed };
            }
        } catch (e) {
            console.error("Failed to load DB", e);
        }
        // Initialize if empty
        this.save(INITIAL_DB);
        return INITIAL_DB;
    }

    private save(data: DatabaseSchema) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            this.data = data;
        } catch (e) {
            console.error("Failed to save DB", e);
        }
    }

    // --- GENERIC GETTERS/SETTERS ---
    
    public getUsers() { return this.data.users; }
    
    public addUser(email: string, passwordHash: string, profile: UserProfile) {
        if (this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            throw new Error("Email already registered.");
        }
        this.data.users.push({ email, passwordHash, profile });
        this.save(this.data);
        return profile;
    }

    public updateUser(userId: string, updates: Partial<UserProfile>) {
        const idx = this.data.users.findIndex(u => u.profile.id === userId);
        if (idx !== -1) {
            this.data.users[idx].profile = { ...this.data.users[idx].profile, ...updates };
            this.save(this.data);
            return this.data.users[idx].profile;
        }
        return null;
    }

    public updateUserByEmail(email: string, updates: any) {
        const idx = this.data.users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
        if (idx !== -1) {
            this.data.users[idx] = { ...this.data.users[idx], ...updates };
            this.save(this.data);
        }
    }

    public getHackathons() { return this.data.hackathons; }
    
    public addHackathon(hackathon: Hackathon) {
        this.data.hackathons.unshift(hackathon);
        this.save(this.data);
    }
    
    public updateHackathon(id: string, updates: Partial<Hackathon>) {
        const idx = this.data.hackathons.findIndex(h => h.id === id);
        if (idx !== -1) {
            this.data.hackathons[idx] = { ...this.data.hackathons[idx], ...updates };
            this.save(this.data);
        }
    }

    public addHackathonRegistration(hackathonId: string, registration: Registration) {
        const idx = this.data.hackathons.findIndex(h => h.id === hackathonId);
        if (idx !== -1) {
            if (!this.data.hackathons[idx].registrations) {
                this.data.hackathons[idx].registrations = [];
            }
            this.data.hackathons[idx].registrations!.push(registration);
            this.data.hackathons[idx].participants += 1;
            this.save(this.data);
        }
    }

    public getTeamRequests() { return this.data.teamRequests; }
    
    public addTeamRequest(req: TeamRequest) {
        this.data.teamRequests.push(req);
        this.save(this.data);
    }

    public updateTeamRequest(id: string, updates: Partial<TeamRequest>) {
        const idx = this.data.teamRequests.findIndex(r => r.id === id);
        if (idx !== -1) {
            this.data.teamRequests[idx] = { ...this.data.teamRequests[idx], ...updates };
            this.save(this.data);
            return this.data.teamRequests[idx];
        }
        return null;
    }

    public getChats() { return this.data.chats; }
    
    public addChat(msg: ChatMessage) {
        this.data.chats.push(msg);
        this.save(this.data);
    }

    public getHiringRequests() { return this.data.hiringRequests; }
    
    public addHiringRequest(req: HiringRequest) {
        this.data.hiringRequests.push(req);
        this.save(this.data);
    }
}

// Singleton Instance
export const db = new Database();


// --- SERVICE EXPORTS (API Layer) ---

// 1. Auth Services
export const authService = {
    login: async (email: string, password: string): Promise<UserProfile> => {
        // Simulate network delay
        await new Promise(r => setTimeout(r, 500));
        
        const user = db.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) throw new Error("Account not found. Please Sign Up to continue.");
        if (user.passwordHash !== btoa(password)) throw new Error("Incorrect password. Please try again.");
        
        return user.profile;
    },

    signup: async (email: string, password: string, role: Role, profileData: any): Promise<UserProfile> => {
        await new Promise(r => setTimeout(r, 800));
        
        // Construct Profile
        const base = {
            id: 'u-' + Date.now(),
            email,
            photoURL: `https://api.dicebear.com/9.x/avataaars/svg?seed=${email}&backgroundColor=c0aede`,
            name: profileData.name || email.split('@')[0],
            bio: profileData.bio || ''
            // role is explicitly added below to avoid type widening issues
        };

        let profile: UserProfile;
        if (role === 'student') {
            profile = { ...base, role: 'student', xp: 0, level: 1, badges: [], rating: 1000, skills: profileData.skills || [], interests: profileData.interests || [] } as StudentProfile;
        } else if (role === 'organizer') {
            profile = { ...base, role: 'organizer', organizationName: profileData.organizationName || '', location: profileData.location || '', themes: profileData.themes || [], website: profileData.website || '' } as unknown as any;
        } else {
            profile = { ...base, role: 'professional', company: profileData.company, position: profileData.position, yearsOfExperience: profileData.yearsOfExperience, skills: profileData.skills, domainExpertise: profileData.domainExpertise, hiringRequirements: profileData.hiringRequirements } as unknown as any;
        }

        return db.addUser(email, btoa(password), profile);
    },

    resetPassword: async (email: string) => {
        const user = db.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) throw new Error("Email not registered.");
        
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`[MOCK EMAIL] OTP for ${email}: ${otp}`);
        db.updateUserByEmail(email, { otp });
    },

    confirmPasswordReset: async (email: string, otp: string, newPassword: string) => {
        const user = db.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) throw new Error("User not found.");
        if (user.otp !== otp) throw new Error("Invalid OTP.");
        
        db.updateUserByEmail(email, { passwordHash: btoa(newPassword), otp: undefined });
    },

    updateProfile: (userId: string, updates: Partial<UserProfile>) => {
        return db.updateUser(userId, updates);
    }
};


// 2. Hackathon Services
export const fetchHackathons = async (): Promise<Hackathon[]> => {
    return db.getHackathons();
};

export const addHackathon = async (data: Omit<Hackathon, 'id'>): Promise<void> => {
    db.addHackathon({ ...data, id: 'h-' + Date.now() });
};

export const updateHackathon = async (id: string, data: Partial<Hackathon>): Promise<void> => {
    db.updateHackathon(id, data);
};

export const registerForHackathon = async (hackathonId: string, data: Omit<Registration, 'timestamp'>): Promise<void> => {
    const registration: Registration = {
        ...data,
        timestamp: Date.now()
    };
    db.addHackathonRegistration(hackathonId, registration);
};


// 3. User & Student Services
export const fetchStudents = async (): Promise<UserProfile[]> => {
    return db.getUsers().map(u => u.profile);
};

export const fetchTeamMembers = async (currentUserId: string): Promise<UserProfile[]> => {
    const user = db.getUsers().find(u => u.profile.id === currentUserId)?.profile as StudentProfile;
    if (!user || !user.teamId) return [];
    
    return db.getUsers()
        .map(u => u.profile)
        .filter(p => p.id !== currentUserId && (p as StudentProfile).teamId === user.teamId);
};

export const fetchLeaderboard = async (): Promise<UserProfile[]> => {
    return db.getUsers()
        .map(u => u.profile)
        .filter(u => u.role === 'student')
        .sort((a, b) => ((b as StudentProfile).rating || 0) - ((a as StudentProfile).rating || 0));
};


// 4. Team Request Services
export const sendTeamRequest = async (sender: StudentProfile, receiverId: string): Promise<void> => {
    const existing = db.getTeamRequests().find(r => 
        (r.senderId === sender.id && r.receiverId === receiverId && r.status === 'pending')
    );
    if (existing) throw new Error("Request already pending");

    const newReq: TeamRequest = {
        id: 'tr-' + Date.now(),
        senderId: sender.id,
        senderName: sender.name,
        senderPhoto: sender.photoURL,
        receiverId,
        status: 'pending',
        timestamp: Date.now()
    };
    db.addTeamRequest(newReq);
};

export const fetchTeamRequests = async (userId: string): Promise<TeamRequest[]> => {
    return db.getTeamRequests().filter(r => r.receiverId === userId && r.status === 'pending');
};

export const fetchSentTeamRequests = async (senderId: string): Promise<TeamRequest[]> => {
    return db.getTeamRequests().filter(r => r.senderId === senderId);
};

export const respondToTeamRequest = async (requestId: string, action: 'accept' | 'decline'): Promise<string | null> => {
    const req = db.updateTeamRequest(requestId, { status: action === 'accept' ? 'accepted' : 'rejected' });
    if (!req) return null;

    if (action === 'accept') {
        const sender = db.getUsers().find(u => u.profile.id === req.senderId)?.profile as StudentProfile;
        const receiver = db.getUsers().find(u => u.profile.id === req.receiverId)?.profile as StudentProfile;
        
        if (sender && receiver) {
            let teamId = sender.teamId || receiver.teamId || ('team-' + Date.now());
            
            // Update both users
            db.updateUser(sender.id, { teamId });
            db.updateUser(receiver.id, { teamId });
            
            return teamId;
        }
    }
    return null;
};


// 5. Chat Services
export const fetchChatMessages = async (roomId: string): Promise<ChatMessage[]> => {
    return db.getChats()
        .filter(c => c.roomId === roomId)
        .sort((a, b) => a.timestamp - b.timestamp);
};

export const sendChatMessage = async (msg: ChatMessage): Promise<void> => {
    db.addChat(msg);
};


// 6. Hiring Services
export const sendHiringRequest = async (request: Omit<HiringRequest, 'id' | 'timestamp' | 'status'>): Promise<void> => {
    db.addHiringRequest({ ...request, id: 'hr-' + Date.now(), timestamp: Date.now(), status: 'pending' });
};

export const fetchSentRequests = async (senderId: string): Promise<HiringRequest[]> => {
    return db.getHiringRequests().filter(r => r.senderId === senderId);
};
