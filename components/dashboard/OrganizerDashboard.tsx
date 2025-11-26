
import React, { useState } from 'react';
import { Plus, Users, MessageSquare, BarChart, X, Edit, Target, Globe } from 'lucide-react';
import { ChatRoom } from '../chat/ChatRoom';
import { MOCK_HACKATHONS, addHackathon, updateHackathon } from '../../services/data';

export const OrganizerDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('active');
    const [showPostForm, setShowPostForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ title: '', date: '', location: '', description: '', themes: '', website: '' });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const themesArray = formData.themes.split(',').map(t => t.trim()).filter(t => t);

        if (isEditing && editId) {
            await updateHackathon(editId, {
                title: formData.title,
                date: formData.date,
                location: formData.location,
                description: formData.description,
                themes: themesArray,
                website: formData.website
            });
            alert('Hackathon Updated!');
        } else {
            await addHackathon({
                title: formData.title,
                date: formData.date,
                location: formData.location,
                description: formData.description,
                image: `https://picsum.photos/400/200?random=${Date.now()}`,
                organizerId: 'current-user',
                participants: 0,
                themes: themesArray,
                website: formData.website
            });
            alert('Hackathon Posted Successfully!');
        }

        setShowPostForm(false);
        setIsEditing(false);
        setEditId(null);
        setFormData({ title: '', date: '', location: '', description: '', themes: '', website: '' });
    };

    const handleEdit = (hackathon: any) => {
        setFormData({
            title: hackathon.title,
            date: hackathon.date,
            location: hackathon.location || '',
            description: hackathon.description,
            themes: hackathon.themes ? hackathon.themes.join(', ') : '',
            website: hackathon.website || ''
        });
        setEditId(hackathon.id);
        setIsEditing(true);
        setShowPostForm(true);
    };

    const openNewPost = () => {
        setFormData({ title: '', date: '', location: '', description: '', themes: '', website: '' });
        setIsEditing(false);
        setEditId(null);
        setShowPostForm(true);
    };

    return (
        <div className="space-y-8 relative">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Organizer Portal</h2>
                    <p className="text-gray-500">Manage your events and community</p>
                </div>
                <button 
                    onClick={openNewPost}
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30"
                >
                    <Plus size={18} className="mr-2" />
                    New Hackathon
                </button>
            </header>

            {/* Post/Edit Hackathon Modal */}
            {showPostForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 dark:border-gray-700 animate-fade-in-up">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
                            <h3 className="text-xl font-bold">{isEditing ? 'Edit Hackathon' : 'Post New Hackathon'}</h3>
                            <button onClick={() => setShowPostForm(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Event Title</label>
                                <input required className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Date</label>
                                    <input required type="text" placeholder="e.g. Oct 15-17" className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Location</label>
                                    <input required type="text" placeholder="e.g. Online" className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 flex items-center"><Target size={14} className="mr-1"/> Themes (comma separated)</label>
                                <input type="text" placeholder="AI, Blockchain, Education" className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600" value={formData.themes} onChange={e => setFormData({...formData, themes: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 flex items-center"><Globe size={14} className="mr-1"/> Website / Link</label>
                                <input type="text" placeholder="https://..." className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea required rows={3} className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                            </div>
                            <button type="submit" className="w-full py-3 bg-primary-600 text-white rounded-lg font-bold hover:bg-primary-700">
                                {isEditing ? 'Update Event' : 'Publish Event'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center text-primary-600 mb-2">
                        <Users className="mr-2" />
                        <h3 className="font-semibold">Total Participants</h3>
                    </div>
                    <p className="text-3xl font-bold">2,450</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center text-green-600 mb-2">
                        <BarChart className="mr-2" />
                        <h3 className="font-semibold">Submission Rate</h3>
                    </div>
                    <p className="text-3xl font-bold">78%</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center text-purple-600 mb-2">
                        <MessageSquare className="mr-2" />
                        <h3 className="font-semibold">Active Discussions</h3>
                    </div>
                    <p className="text-3xl font-bold">12</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Event Management */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
                    <div className="border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex gap-6">
                        <button 
                            onClick={() => setActiveTab('active')}
                            className={`text-sm font-medium pb-4 -mb-4 border-b-2 transition-colors ${activeTab === 'active' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'}`}
                        >
                            Active Events
                        </button>
                    </div>
                    <div className="p-6 flex-1">
                        {activeTab === 'active' ? (
                            <div className="space-y-4">
                                {MOCK_HACKATHONS.slice(0, 3).map(h => (
                                    <div key={h.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 group">
                                        <div>
                                            <p className="font-bold">{h.title}</p>
                                            <div className="flex gap-2 text-xs text-gray-500 mt-1">
                                                <span>{h.participants} participants</span>
                                                {h.themes && h.themes.length > 0 && (
                                                    <span>• {h.themes[0]}</span>
                                                )}
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleEdit(h)}
                                            className="text-xs px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/50 hover:text-primary-600 transition-colors flex items-center"
                                        >
                                            <Edit size={12} className="mr-1" /> Edit
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Community Chat - Live */}
                <div className="flex flex-col h-[500px]">
                    <h3 className="font-bold mb-4 flex items-center"><MessageSquare className="mr-2 text-primary-600"/> Community Chat</h3>
                    <div className="flex-1 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
                        <ChatRoom roomId="organizer-general" />
                    </div>
                </div>
            </div>
        </div>
    );
};
