import { GoogleGenAI } from "@google/genai";
import { UserProfile } from "../types";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
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

    try {
        const prompt = `
            Analyze the compatibility of these two students for a hackathon team. 
            User 1: ${user1.name}, Skills: ${user1.skills.join(', ')}, Interests: ${user1.interests.join(', ')}, Bio: ${user1.bio}, Rating: ${user1.rating}.
            User 2: ${user2.name}, Skills: ${user2.skills.join(', ')}, Interests: ${user2.interests.join(', ')}, Bio: ${user2.bio}, Rating: ${user2.rating}.
            
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