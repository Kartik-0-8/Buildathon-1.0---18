import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchChatMessages } from '../../services/data';
import { ChatMessage } from '../../types';
import { Send } from 'lucide-react';

export const ChatRoom: React.FC<{ roomId: string }> = ({ roomId }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const load = async () => {
            const msgs = await fetchChatMessages(roomId);
            setMessages(msgs);
        };
        load();
        // In real Firebase, this would be onSnapshot
        const interval = setInterval(load, 5000); 
        return () => clearInterval(interval);
    }, [roomId]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        const msg: ChatMessage = {
            id: Date.now().toString(),
            senderId: user.id,
            senderName: user.name,
            text: newMessage,
            timestamp: Date.now()
        };

        setMessages([...messages, msg]);
        setNewMessage('');
        // In real Firebase: await addDoc(collection(db, ...), msg);
    };

    return (
        <div className="flex flex-col h-[600px] bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-bold">Team Chat</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                    const isMe = msg.senderId === user?.id;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] rounded-lg p-3 ${
                                isMe 
                                ? 'bg-primary-600 text-white rounded-br-none' 
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
                            }`}>
                                <p className="text-xs opacity-75 mb-1">{msg.senderName}</p>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <form onSubmit={handleSend} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button type="submit" className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700">
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};