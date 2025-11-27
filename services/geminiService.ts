import { GoogleGenAI } from "@google/genai";
import { UserProfile, StudentProfile } from "../types";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        // Fallback for demo purposes if env is missing
        console.warn("Gemini API Key is missing");
        return null;
    }
    return new GoogleGenAI({ apiKey });
}

export const generateBio = async (skills: string[], interests: string[], role: string): Promise<string> => {
    const ai = getClient();
    if (!ai) return "AI services unavailable. Please add API Key.";

    try {
        const prompt = `Write a short, punchy, professional bio (max 40 words) for a ${role} with skills: ${skills.join(', ')} and interests: ${interests.join(', ')}. Do not use hashtags.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text || "Could not generate bio.";
    } catch (error) {
        console.error("Gemini Error:", error);
        return "Error generating bio.";
    }
};

export const suggestBadges = async (skills: string[], xp: number): Promise<string[]> => {
    const ai = getClient();
    if (!ai) return ["Self-Starter", "Tech Enthusiast"];

    try {
        const prompt = `Given a user with skills [${skills.join(', ')}] and ${xp} XP, suggest 3 short, creative achievement badges they might have earned. Return only comma separated values.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const text = response.text || "";
        return text.split(',').map(s => s.trim()).slice(0, 3);
    } catch (error) {
        return ["Badge-1", "Badge-2"];
    }
}

export const getAiSuggestions = async (userProfile: any): Promise<string> => {
    const ai = getClient();
    if (!ai) return "Connect API Key for AI suggestions.";

    try {
        const prompt = `
            Based on this user profile, suggest 3 concise, actionable goals to improve their hackathon success rate.
            User Profile: ${JSON.stringify({ skills: userProfile.skills, interests: userProfile.interests, level: userProfile.level })}
            Format: specific bullet points.
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text || "No suggestions available.";
    } catch (error) {
        console.error("Gemini Error:", error);
        return "Could not fetch AI suggestions.";
    }
};

export const getMatchAnalysis = async (user1: UserProfile, user2: UserProfile): Promise<string> => {
    const ai = getClient();
    if (!ai) return "AI Analysis unavailable without API Key. Based on skills, this looks like a good match.";

    const getProfileDetails = (u: UserProfile) => {
        if (u.role === 'student') {
            return `Skills: ${u.skills.join(', ')}, Interests: ${u.interests.join(', ')}, Bio: ${u.bio}, Rating: ${u.rating}`;
        }
        return `Bio: ${u.bio}, Role: ${u.role}`;
    };

    try {
        const prompt = `
            Analyze the compatibility of these two students for a hackathon team. 
            User 1: ${user1.name}, ${getProfileDetails(user1)}
            User 2: ${user2.name}, ${getProfileDetails(user2)}
            
            Provide a 2-sentence analysis on why they would work well together or what challenges they might face. Focus on technical synergy.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text || "Analysis complete.";
    } catch (error) {
        console.error(error);
        return "Could not perform AI analysis.";
    }
}

export const getAiChatSession = (userProfile: UserProfile) => {
    const ai = getClient();
    // Return a mock object if no AI client
    if (!ai) return null;

    let details = '';
    if (userProfile.role === 'student') {
        details = `
        Their Skills: ${userProfile.skills.join(', ')}.
        Their Interests: ${userProfile.interests.join(', ')}.
        `;
    }

    const systemInstruction = `You are "Coach X", an enthusiastic and wise AI mentor for a hackathon platform called CollabX. 
    You are talking to ${userProfile.name}, a ${userProfile.role}.
    ${details}
    Their Bio: ${userProfile.bio}.
    
    Your goal is to help them find teammates, improve their skills, and win hackathons.
    Keep your responses concise, encouraging, and actionable. Use emojis occasionally.`;

    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstruction,
        }
    });
};

export const generateHackathonDescription = async (title: string, themes: string[]): Promise<string> => {
    const ai = getClient();
    if (!ai) return "Join us for an exciting hackathon event! (AI Unavailable)";

    try {
        const prompt = `Write a compelling, exciting 2-sentence description for a hackathon titled "${title}" focusing on these themes: ${themes.join(', ')}. Include a call to action.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text || "";
    } catch (error) {
        console.error("Gemini Error:", error);
        return "Join us for an exciting event!";
    }
};

export const generateJobDescription = async (hiringType: string, skills: string[], domain: string): Promise<string> => {
    const ai = getClient();
    if (!ai) return "We are looking for talented individuals to join our team. (AI Unavailable)";

    try {
        const prompt = `Write a professional, attractive 2-sentence project description for a ${hiringType} role. 
        Required Skills: ${skills.join(', ')}. 
        Domain: ${domain}.
        Highlight the impact of the work.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text || "";
    } catch (error) {
        console.error("Gemini Error:", error);
        return "Exciting opportunity to work on cutting-edge projects.";
    }
};