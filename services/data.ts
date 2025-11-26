import { UserProfile, Hackathon, ChatMessage } from '../types';

// --- Mock Data Constants ---

export const MOCK_HACKATHONS: Hackathon[] = [
  {
    id: 'h1',
    title: 'Global AI Challenge',
    date: 'Oct 15-17',
    description: 'Build the future of Generative AI.',
    image: 'https://picsum.photos/400/200?random=1',
    organizerId: 'org1',
    participants: 1240
  },
  {
    id: 'h2',
    title: 'GreenEarth Hack',
    date: 'Nov 05-07',
    description: 'Sustainable tech solutions for a better planet.',
    image: 'https://picsum.photos/400/200?random=2',
    organizerId: 'org2',
    participants: 850
  },
  {
    id: 'h3',
    title: 'FinTech Revolution',
    date: 'Nov 20-22',
    description: 'Disrupting the banking industry.',
    image: 'https://picsum.photos/400/200?random=3',
    organizerId: 'org3',
    participants: 600
  },
  {
    id: 'h4',
    title: 'EdTech Heroes',
    date: 'Dec 01-03',
    description: 'Gamifying education for the next gen.',
    image: 'https://picsum.photos/400/200?random=4',
    organizerId: 'org1',
    participants: 430
  },
  {
    id: 'h5',
    title: 'Health++ Mock',
    date: 'Jan 10-12',
    description: 'Healthcare innovation sprint.',
    image: 'https://picsum.photos/400/200?random=5',
    organizerId: 'org2',
    participants: 900
  }
];

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'u2',
    name: 'Alice Chen',
    email: 'alice@example.com',
    role: 'student',
    photoURL: 'https://picsum.photos/100/100?random=10',
    bio: 'Full Stack Dev loving React & Node.',
    skills: ['React', 'Node.js', 'TypeScript'],
    interests: ['FinTech', 'AI'],
    xp: 450,
    level: 4,
    badges: ['Top Coder', 'Night Owl'],
    rating: 1450
  },
  {
    id: 'u3',
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'student',
    photoURL: 'https://picsum.photos/100/100?random=11',
    bio: 'Data Scientist in training.',
    skills: ['Python', 'PyTorch', 'SQL'],
    interests: ['AI', 'HealthTech'],
    xp: 200,
    level: 2,
    badges: ['Data Wizard'],
    rating: 1200
  },
  {
    id: 'u4',
    name: 'Charlie Kim',
    email: 'charlie@example.com',
    role: 'student',
    photoURL: 'https://picsum.photos/100/100?random=12',
    bio: 'UX Designer looking for devs.',
    skills: ['Figma', 'UI/UX', 'CSS'],
    interests: ['EdTech', 'GreenTech'],
    xp: 600,
    level: 6,
    badges: ['Pixel Perfect', 'Team Player'],
    rating: 1600
  },
  {
    id: 'u5',
    name: 'Diana Prince',
    email: 'diana@example.com',
    role: 'student',
    photoURL: 'https://picsum.photos/100/100?random=13',
    bio: 'Cybersecurity enthusiast.',
    skills: ['Python', 'Network Security', 'Linux'],
    interests: ['Security', 'FinTech'],
    xp: 800,
    level: 8,
    badges: ['Bug Hunter', 'CTF Champ'],
    rating: 1850
  },
  {
    id: 'u6',
    name: 'Evan Wright',
    email: 'evan@example.com',
    role: 'student',
    photoURL: 'https://picsum.photos/100/100?random=14',
    bio: 'Mobile Dev (Flutter/iOS).',
    skills: ['Flutter', 'Dart', 'Swift'],
    interests: ['Social', 'EdTech'],
    xp: 350,
    level: 3,
    badges: ['App Master'],
    rating: 1320
  }
];

export const MOCK_TEAM_MEMBERS: UserProfile[] = [
    {
        id: 'tm1',
        name: 'Sarah Jones',
        email: 'sarah@example.com',
        role: 'student',
        photoURL: 'https://picsum.photos/100/100?random=20',
        bio: 'Backend Wizard.',
        skills: ['Go', 'Kubernetes'],
        interests: ['Cloud'],
        xp: 300,
        level: 3,
        badges: [],
        rating: 1280
    },
    {
        id: 'tm2',
        name: 'Mike Ross',
        email: 'mike@example.com',
        role: 'student',
        photoURL: 'https://picsum.photos/100/100?random=21',
        bio: 'Product Manager.',
        skills: ['Strategy', 'Communication'],
        interests: ['Business'],
        xp: 150,
        level: 1,
        badges: [],
        rating: 1100
    }
];

// --- Simulation Service ---

export const fetchHackathons = async (): Promise<Hackathon[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  return MOCK_HACKATHONS;
};

export const addHackathon = async (data: Omit<Hackathon, 'id'>): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const newHack: Hackathon = {
    ...data,
    id: 'h-' + Date.now()
  };
  MOCK_HACKATHONS.unshift(newHack);
}

export const updateHackathon = async (id: string, data: Partial<Hackathon>): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = MOCK_HACKATHONS.findIndex(h => h.id === id);
    if (index !== -1) {
        MOCK_HACKATHONS[index] = { ...MOCK_HACKATHONS[index], ...data };
    }
}

export const fetchStudents = async (): Promise<UserProfile[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_USERS;
};

export const fetchTeamMembers = async (): Promise<UserProfile[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return MOCK_TEAM_MEMBERS;
}

export const fetchChatMessages = async (roomId: string): Promise<ChatMessage[]> => {
  return [
    { id: 'm1', senderId: 'u2', senderName: 'Alice', text: "Anyone interested in the AI track?", timestamp: Date.now() - 100000 },
    { id: 'm2', senderId: 'u3', senderName: 'Bob', text: "I am! I can handle the ML models.", timestamp: Date.now() - 50000 },
  ];
};

export const fetchLeaderboard = async (): Promise<UserProfile[]> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    // Sort users by rating (descending)
    return [...MOCK_USERS].sort((a, b) => b.rating - a.rating);
}