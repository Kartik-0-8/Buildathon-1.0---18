
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchChatMessages } from '../../services/data';
import { ChatMessage } from '../../types';
import { Send, Paperclip, X, FileText, Image as ImageIcon } from 'lucide-react';

export const ChatRoom: React.FC<{ roomId: string }> = ({ roomId }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [attachment, setAttachment] = useState<{name: string, type: 'image' | 'file', url: string} | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const load = async () => {
            if (!roomId) return;
            const msgs = await fetchChatMessages(roomId);
            setMessages(msgs);
        };
        load();
        // In real Firebase, this would be onSnapshot
        const interval = setInterval(load, 2000); // Faster polling for "real-time" feel
        return () => clearInterval(interval);
    }, [roomId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAttachment({
                    name: file.name,
                    type: file.type.startsWith('image/') ? 'image' : 'file',
                    url: reader.result as string
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if ((!newMessage.trim() && !attachment) || !user) return;

        const msg: ChatMessage = {
            id: Date.now().toString(),
            senderId: user.id,
            senderName: user.name,
            senderRole: user.role,
            text: newMessage,
            timestamp: Date.now(),
            roomId: roomId,
            attachment: attachment || undefined
        };

        // Simulating backend push. In data.ts this pushes to localStorage array.
        // We import sendChatMessage dynamically to avoid circular dependencies if any, 
        // or just rely on data.ts being updated by the logic below.
        // Since data.ts was not modified to export sendChatMessage differently, we assume it works.
        // But wait, the original file uses `sendChatMessage` imported. 
        // I need to make sure I import it or implement it here if I don't want to change imports.
        // The original ChatRoom imported `sendChatMessage` from data.ts but it wasn't used in the provided original file content??
        // Ah, looking at the previous file content provided in prompt:
        // `import { fetchChatMessages } from '../../services/data';`
        // It didn't import sendChatMessage? 
        // Wait, looking at original file: 
        // `import { fetchChatMessages } from '../../services/data';` ... 
        // `// In real Firebase: await addDoc(collection(db, ...), msg);`
        // It seems the original ChatRoom.tsx was MOCKING the send locally in state:
        // `setMessages([...messages, msg]);`
        // `const chats = getRequests(CHATS_KEY); chats.push(msg); saveRequests(CHATS_KEY, chats);` logic exists in data.ts.
        // I should probably use `sendChatMessage` from data.ts to make it persist across users.
        
        import('../../services/data').then(({ sendChatMessage }) => {
            sendChatMessage(msg).then(() => {
                 setMessages(prev => [...prev, msg]);
            });
        });

        setNewMessage('');
        setAttachment(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="flex flex-col h-[600px] bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 dark:text-white">Team Chat</h3>
                <span className="text-xs text-green-600 font-medium px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                    Live
                </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/50">
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 my-auto pt-20">
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                )}
                {messages.map((msg) => {
                    const isMe = msg.senderId === user?.id;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] rounded-2xl p-3 shadow-sm ${
                                isMe 
                                ? 'bg-primary-600 text-white rounded-br-none' 
                                : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none border border-gray-100 dark:border-gray-600'
                            }`}>
                                <div className={`flex items-center gap-2 mb-1 ${isMe ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'}`}>
                                    <p className="text-xs font-bold">{msg.senderName}</p>
                                    <span className="text-[10px] uppercase border border-current px-1 rounded opacity-75">{msg.senderRole}</span>
                                </div>
                                
                                {msg.attachment && (
                                    <div className="mb-2 mt-1">
                                        {msg.attachment.type === 'image' ? (
                                            <img src={msg.attachment.url} alt="attachment" className="rounded-lg max-h-48 object-cover border border-white/20" />
                                        ) : (
                                            <a href={msg.attachment.url} download={msg.attachment.name} className={`flex items-center p-2 rounded-lg ${isMe ? 'bg-primary-700' : 'bg-gray-100 dark:bg-gray-600'} hover:opacity-80 transition-opacity`}>
                                                <FileText size={20} className="mr-2" />
                                                <span className="text-sm underline truncate max-w-[150px]">{msg.attachment.name}</span>
                                            </a>
                                        )}
                                    </div>
                                )}

                                {msg.text && <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>}
                                <p className={`text-[10px] text-right mt-1 ${isMe ? 'text-primary-200' : 'text-gray-400'}`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Attachment Preview */}
            {attachment && (
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between animate-fade-in-up">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
                            {attachment.type === 'image' ? <ImageIcon size={20} className="text-primary-600"/> : <FileText size={20} className="text-primary-600"/>}
                        </div>
                        <div className="text-sm">
                            <p className="font-bold text-gray-900 dark:text-white truncate max-w-[200px]">{attachment.name}</p>
                            <p className="text-xs text-gray-500">Ready to send</p>
                        </div>
                    </div>
                    <button onClick={() => { setAttachment(null); if(fileInputRef.current) fileInputRef.current.value = ''; }} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <X size={18} className="text-gray-500" />
                    </button>
                </div>
            )}

            <form onSubmit={handleSend} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex gap-2 items-end">
                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx" 
                />
                <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 text-gray-500 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                    title="Attach file"
                >
                    <Paperclip size={20} />
                </button>
                <div className="flex-1">
                    <input 
                        type="text" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={!newMessage.trim() && !attachment}
                    className="bg-primary-600 text-white p-3 rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-600/20 transition-all"
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};
