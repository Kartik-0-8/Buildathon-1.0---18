import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../../types';
import { getAiChatSession } from '../../services/geminiService';
import { X, Send, Bot, User, Sparkles } from 'lucide-react';

interface AICoachChatProps {
    user: UserProfile;
    onClose: () => void;
}

interface Message {
    id: string;
    sender: 'user' | 'ai';
    text: string;
}

export const AICoachChat: React.FC<AICoachChatProps> = ({ user, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', sender: 'ai', text: `Hi ${user.name}! I'm Coach X. How can I help you level up today?` }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const chatSession = useRef<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initialize chat session
        const session = getAiChatSession(user);
        if (session) {
            chatSession.current = session;
        }
    }, [user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            let aiText = "I'm having trouble connecting to my brain right now. Please check your API Key.";
            
            if (chatSession.current) {
                const result = await chatSession.current.sendMessage({ message: userMsg.text });
                aiText = result.text;
            } else {
                // Mock response if no API key
                await new Promise(resolve => setTimeout(resolve, 1000));
                aiText = "I'm in demo mode! Add a Gemini API Key to chat for real. But I think you're doing great! 🚀";
            }

            const aiMsg: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: aiText };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: "Sorry, I encountered an error. Try again!" }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 w-full max-w-md h-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <Bot size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold">Coach X</h3>
                            <p className="text-xs text-indigo-100 flex items-center">
                                <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                                Online
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex items-end max-w-[80%] gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-purple-100 text-purple-600'}`}>
                                    {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                                </div>
                                <div className={`p-3 rounded-2xl text-sm ${
                                    msg.sender === 'user' 
                                    ? 'bg-indigo-600 text-white rounded-br-none' 
                                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-bl-none shadow-sm'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                             <div className="flex items-end gap-2">
                                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                                    <Bot size={14} />
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-bl-none border border-gray-100 dark:border-gray-700 shadow-sm">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></span>
                                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex gap-2">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask for advice..."
                        className="flex-1 bg-gray-100 dark:bg-gray-900 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button 
                        type="submit" 
                        disabled={!input.trim() || isTyping}
                        className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};