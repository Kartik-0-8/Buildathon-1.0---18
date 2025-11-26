
import { UserProfile, Hackathon, ChatMessage, StudentProfile, HiringRequest } from '../types';

// --- Mock Data Constants ---

export const MOCK_HACKATHONS: Hackathon[] = [
  {
    id: 'h6',
    title: 'Delhi NCR Innovate',
    date: 'Nov 29-30',
    location: 'New Delhi, NCR',
    description: 'The biggest tech sprint in North India focusing on Smart Cities.',
    image: 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?auto=format&fit=crop&q=80&w=400',
    organizerId: 'org4',
    participants: 1500,
    themes: ['Smart City', 'IoT']
  },
  {
    id: 'h7',
    title: 'Mumbai FinTech Expo',
    date: 'Nov 27-28',
    location: 'Mumbai, Maharashtra',
    description: 'Revolutionizing finance in the commercial capital of India.',
    image: 'https://images.unsplash.com/photo-1567473030492-533b30c5494c?auto=format&fit=crop&q=80&w=400',
    organizerId: 'org5',
    participants: 2100,
    themes: ['FinTech', 'Blockchain']
  },
  {
    id: 'h8',
    title: 'Bengaluru AI Summit',
    date: 'Dec 05-07',
    location: 'Bangalore, Karnataka',
    description: 'Join top developers in the Silicon Valley of India for an AI showdown.',
    image: 'https://images.unsplash.com/photo-1596720426673-e4e14290f0cc?auto=format&fit=crop&q=80&w=400',
    organizerId: 'org6',
    participants: 3200,
    themes: ['AI', 'ML']
  },
  {
    id: 'h1',
    title: 'Global AI Challenge',
    date: 'Dec 09-10',
    location: 'Online / Remote',
    description: 'Build the future of Generative AI.',
    image: 'https://picsum.photos/400/200?random=1',
    organizerId: 'org1',
    participants: 1240,
    themes: ['AI', 'Generative']
  },
  {
    id: 'h2',
    title: 'GreenEarth Hack',
    date: 'Jan 05-06, 2026',
    location: 'London, UK',
    description: 'Sustainable tech solutions for a better planet.',
    image: 'https://picsum.photos/400/200?random=2',
    organizerId: 'org2',
    participants: 850,
    themes: ['Sustainability', 'GreenTech']
  },
  {
    id: 'h3',
    title: 'FinTech Revolution',
    date: 'Jan 02-03, 2026',
    location: 'New York, USA',
    description: 'Disrupting the banking industry.',
    image: 'https://picsum.photos/400/200?random=3',
    organizerId: 'org3',
    participants: 600,
    themes: ['FinTech', 'DeFi']
  },
  {
    id: 'h9',
    title: 'CyberDefense 2024',
    date: 'Feb 10-12, 2026',
    location: 'Tel Aviv, Israel',
    description: 'Protecting the digital frontier. Advanced CTF challenges included.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400',
    organizerId: 'org9',
    participants: 900,
    themes: ['Cybersecurity', 'Network']
  },
  {
    id: 'h10',
    title: 'HealthTech Summit',
    date: 'Feb 20-22, 2026',
    location: 'Boston, USA',
    description: 'Innovating for a healthier tomorrow. Wearables and BioTech.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400',
    organizerId: 'org10',
    participants: 1100,
    themes: ['HealthTech', 'BioTech']
  },
  {
    id: 'h11',
    title: 'EdTech Global',
    date: 'Mar 05-07, 2026',
    location: 'Online',
    description: 'Reimagining education through technology.',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=400',
    organizerId: 'org11',
    participants: 2500,
    themes: ['EdTech', 'Social']
  },
  {
    id: 'h12',
    title: 'GameJam X',
    date: 'Mar 15-17, 2026',
    location: 'Tokyo, Japan',
    description: '48 hours to create the next indie hit.',
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=400',
    organizerId: 'org12',
    participants: 1800,
    themes: ['Gaming', 'VR/AR']
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
        name: 'Aparna Singh',
        email: 'aparnasinghanchor@gmail.com',
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

export const MOCK_REQUESTS: HiringRequest[] = [];

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
    return [...MOCK_USERS].sort((a, b) => {
        const ratingA = a.role === 'student' ? a.rating : 0;
        const ratingB = b.role === 'student' ? b.rating : 0;
        return ratingB - ratingA;
    });
}

export const sendHiringRequest = async (request: Omit<HiringRequest, 'id' | 'timestamp' | 'status'>): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const newReq: HiringRequest = {
        ...request,
        id: 'req-' + Date.now(),
        timestamp: Date.now(),
        status: 'pending'
    };
    MOCK_REQUESTS.push(newReq);
    console.log("Request sent:", newReq);
}

export const fetchSentRequests = async (senderId: string): Promise<HiringRequest[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return MOCK_REQUESTS.filter(r => r.senderId === senderId);
}
