
import { UserProfile, Hackathon, ChatMessage, StudentProfile, HiringRequest, TeamRequest } from '../types';

// Storage Keys
const DB_KEY = 'collabx_users_db';
const REQUESTS_KEY = 'collabx_team_requests';
const HIRING_REQUESTS_KEY = 'collabx_hiring_requests';
const CHATS_KEY = 'collabx_chats';

// --- Seed Data (Only used to populate DB if empty) ---
const SEED_USERS: UserProfile[] = [
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

// Initialize DB
(() => {
    try {
        const stored = localStorage.getItem(DB_KEY);
        if (!stored) {
            const seeded = SEED_USERS.map(p => ({
                email: p.email,
                password: btoa('password'),
                profile: p
            }));
            localStorage.setItem(DB_KEY, JSON.stringify(seeded));
        }
    } catch(e) { console.error("DB Init Error", e); }
})();

// --- Helpers ---
const getDB = (): any[] => {
    try { return JSON.parse(localStorage.getItem(DB_KEY) || '[]'); } 
    catch { return []; }
};

const saveDB = (data: any[]) => localStorage.setItem(DB_KEY, JSON.stringify(data));

const getRequests = (key: string): any[] => {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); }
    catch { return []; }
}

const saveRequests = (key: string, data: any[]) => localStorage.setItem(key, JSON.stringify(data));

// --- User & Hackathon Data ---

export const MOCK_HACKATHONS: Hackathon[] = [
  { id: 'h6', title: 'Delhi NCR Innovate', date: 'Nov 29-30', location: 'New Delhi, NCR', description: 'The biggest tech sprint in North India.', image: 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?auto=format&fit=crop&q=80&w=400', organizerId: 'org4', participants: 1500, themes: ['Smart City'] },
  { id: 'h7', title: 'Mumbai FinTech Expo', date: 'Nov 27-28', location: 'Mumbai', description: 'Revolutionizing finance.', image: 'https://images.unsplash.com/photo-1567473030492-533b30c5494c?auto=format&fit=crop&q=80&w=400', organizerId: 'org5', participants: 2100, themes: ['FinTech'] },
  { id: 'h1', title: 'Global AI Challenge', date: 'Dec 09-10', location: 'Online', description: 'Build the future of Generative AI.', image: 'https://picsum.photos/400/200?random=1', organizerId: 'org1', participants: 1240, themes: ['AI'] }
];

export const fetchHackathons = async (): Promise<Hackathon[]> => {
  return MOCK_HACKATHONS; // Keep hackathons static for now as requested
};

export const addHackathon = async (data: Omit<Hackathon, 'id'>): Promise<void> => {
    MOCK_HACKATHONS.unshift({ ...data, id: 'h-' + Date.now() });
}

export const updateHackathon = async (id: string, data: Partial<Hackathon>): Promise<void> => {
    const idx = MOCK_HACKATHONS.findIndex(h => h.id === id);
    if (idx !== -1) MOCK_HACKATHONS[idx] = { ...MOCK_HACKATHONS[idx], ...data };
}

// --- Student / User Fetching ---

export const fetchStudents = async (): Promise<UserProfile[]> => {
    // Return all profiles from DB
    const db = getDB();
    return db.map(u => u.profile);
};

export const fetchTeamMembers = async (currentUserId: string): Promise<UserProfile[]> => {
    const db = getDB();
    const currentUser = db.find(u => u.profile.id === currentUserId)?.profile as StudentProfile;
    
    if (!currentUser || !currentUser.teamId) return [];

    // Find all users with same teamId, excluding self
    return db
        .filter(u => u.profile.teamId === currentUser.teamId && u.profile.id !== currentUserId)
        .map(u => u.profile);
}

export const fetchLeaderboard = async (): Promise<UserProfile[]> => {
    const users = await fetchStudents();
    return users.sort((a, b) => {
        const ra = a.role === 'student' ? (a as StudentProfile).rating : 0;
        const rb = b.role === 'student' ? (b as StudentProfile).rating : 0;
        return rb - ra;
    });
}

// --- Team Request System ---

export const sendTeamRequest = async (sender: StudentProfile, receiverId: string): Promise<void> => {
    const requests = getRequests(REQUESTS_KEY);
    
    // Check if exists
    const exists = requests.find((r: TeamRequest) => 
        (r.senderId === sender.id && r.receiverId === receiverId) ||
        (r.senderId === receiverId && r.senderId === sender.id)
    );
    if (exists && exists.status === 'pending') throw new Error("Request already pending");

    const newReq: TeamRequest = {
        id: 'tr-' + Date.now(),
        senderId: sender.id,
        senderName: sender.name,
        senderPhoto: sender.photoURL,
        receiverId: receiverId,
        status: 'pending',
        timestamp: Date.now()
    };

    requests.push(newReq);
    saveRequests(REQUESTS_KEY, requests);
};

export const fetchTeamRequests = async (userId: string): Promise<TeamRequest[]> => {
    const requests = getRequests(REQUESTS_KEY);
    return requests.filter((r: TeamRequest) => r.receiverId === userId && r.status === 'pending');
};

export const fetchSentTeamRequests = async (senderId: string): Promise<TeamRequest[]> => {
    const requests = getRequests(REQUESTS_KEY);
    return requests.filter((r: TeamRequest) => r.senderId === senderId);
};

export const respondToTeamRequest = async (requestId: string, action: 'accept' | 'decline'): Promise<string | null> => {
    const requests = getRequests(REQUESTS_KEY);
    const reqIndex = requests.findIndex((r: TeamRequest) => r.id === requestId);
    
    if (reqIndex === -1) return null;
    
    const req = requests[reqIndex];
    req.status = action === 'accept' ? 'accepted' : 'rejected';
    requests[reqIndex] = req;
    saveRequests(REQUESTS_KEY, requests);

    if (action === 'accept') {
        // Form Team
        const db = getDB();
        const senderIdx = db.findIndex(u => u.profile.id === req.senderId);
        const receiverIdx = db.findIndex(u => u.profile.id === req.receiverId);

        if (senderIdx !== -1 && receiverIdx !== -1) {
            const sender = db[senderIdx].profile as StudentProfile;
            const receiver = db[receiverIdx].profile as StudentProfile;

            let teamId = sender.teamId || receiver.teamId;
            if (!teamId) teamId = 'team-' + Date.now();

            sender.teamId = teamId;
            receiver.teamId = teamId;

            db[senderIdx].profile = sender;
            db[receiverIdx].profile = receiver;
            saveDB(db);
            
            return teamId;
        }
    }
    return null;
};

// --- Chat System ---

export const fetchChatMessages = async (roomId: string): Promise<ChatMessage[]> => {
    const chats = getRequests(CHATS_KEY); // Reusing getRequests helper for general JSON array
    return chats.filter((m: ChatMessage) => m.roomId === roomId).sort((a: any, b: any) => a.timestamp - b.timestamp);
};

export const sendChatMessage = async (msg: ChatMessage): Promise<void> => {
    const chats = getRequests(CHATS_KEY);
    chats.push(msg);
    saveRequests(CHATS_KEY, chats);
}

// --- Hiring Requests (Professional) ---

export const sendHiringRequest = async (request: Omit<HiringRequest, 'id' | 'timestamp' | 'status'>): Promise<void> => {
    const requests = getRequests(HIRING_REQUESTS_KEY);
    const newReq = { ...request, id: 'hr-'+Date.now(), timestamp: Date.now(), status: 'pending' };
    requests.push(newReq);
    saveRequests(HIRING_REQUESTS_KEY, requests);
}

export const fetchSentRequests = async (senderId: string): Promise<HiringRequest[]> => {
    const requests = getRequests(HIRING_REQUESTS_KEY);
    return requests.filter((r: HiringRequest) => r.senderId === senderId);
}
