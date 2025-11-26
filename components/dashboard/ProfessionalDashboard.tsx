
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ProfessionalProfile, HiringRequest } from '../../types';
import { TalentSearch } from './TalentSearch';
import { fetchSentRequests, addHackathon } from '../../services/data';
import { Briefcase, Search, Plus, User, FileText, CheckCircle, Clock } from 'lucide-react';

export const ProfessionalDashboard: React.FC = () => {
    const { user, updateProfile } = useAuth();
    const [activeTab, setActiveTab] = useState<'overview' | 'talent' | 'requests'>('overview');
    const [showPostModal, setShowPostModal] = useState(false);
    const [requests, setRequests] = useState<HiringRequest[]>([]);
    
    // Form for requirement
    const [reqForm, setReqForm] = useState({
        requiredSkills: '',
        domain: '',
        experienceNeeded: 0,
        duration: '',
        stipend: '',
        location: '',
        projectDescription: '',
        hiringType: 'Intern'
    });

    useEffect(() => {
        if (user && activeTab === 'requests') {
            fetchSentRequests(user.id).then(setRequests);
        }
    }, [user, activeTab]);

    const handlePostRequirement = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedReq = {
            requiredSkills: reqForm.requiredSkills.split(',').map(s => s.trim()),
            domain: reqForm.domain,
            experienceNeeded: Number(reqForm.experienceNeeded),
            duration: reqForm.duration,
            stipend: reqForm.stipend,
            location: reqForm.location,
            projectDescription: reqForm.projectDescription,
            hiringType: reqForm.hiringType as any
        };
        
        updateProfile({ hiringRequirements: updatedReq });
        setShowPostModal(false);
        alert("Requirement Posted! Matching logic updated.");
    };

    if (!user || user.role !== 'professional') return <div>Access Denied</div>;
    const prof = user as ProfessionalProfile;

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, {prof.name}</h2>
                    <p className="text-gray-500">{prof.company} • {prof.position}</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowPostModal(true)} className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-primary-700">
                        <Plus size={18} className="mr-2"/> Post Requirement
                    </button>
                </div>
            </header>

            {/* Navigation */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button onClick={() => setActiveTab('overview')} className={`px-6 py-3 border-b-2 font-medium ${activeTab === 'overview' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'}`}>Overview</button>
                <button onClick={() => setActiveTab('talent')} className={`px-6 py-3 border-b-2 font-medium ${activeTab === 'talent' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'}`}>Talent Discovery</button>
                <button onClick={() => setActiveTab('requests')} className={`px-6 py-3 border-b-2 font-medium ${activeTab === 'requests' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'}`}>My Requests</button>
            </div>

            {/* Content Area */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                    <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-2xl p-8 text-white">
                        <h3 className="text-2xl font-bold mb-2">Active Hiring Requirement</h3>
                        {prof.hiringRequirements ? (
                            <div className="space-y-2">
                                <p className="opacity-90 font-medium text-lg">{prof.hiringRequirements.hiringType} Role</p>
                                <p className="opacity-75 text-sm">{prof.hiringRequirements.projectDescription}</p>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {prof.hiringRequirements.requiredSkills.map(s => <span key={s} className="bg-white/20 px-2 py-1 rounded text-xs">{s}</span>)}
                                </div>
                            </div>
                        ) : (
                            <p className="opacity-75">No active requirement. Post one to start matching with students.</p>
                        )}
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                         <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
                         <div className="grid grid-cols-2 gap-4">
                             <button onClick={() => setActiveTab('talent')} className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl flex flex-col items-center justify-center hover:bg-blue-100 transition-colors">
                                 <Search size={24} className="mb-2"/> Scout Talent
                             </button>
                             <button className="p-4 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-xl flex flex-col items-center justify-center hover:bg-purple-100 transition-colors">
                                 <Briefcase size={24} className="mb-2"/> Hackathons
                             </button>
                         </div>
                    </div>
                </div>
            )}

            {activeTab === 'talent' && (
                <div className="animate-fade-in">
                    <TalentSearch />
                </div>
            )}

            {activeTab === 'requests' && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-fade-in">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="p-4 font-medium text-sm text-gray-500">Candidate ID</th>
                                <th className="p-4 font-medium text-sm text-gray-500">Type</th>
                                <th className="p-4 font-medium text-sm text-gray-500">Sent At</th>
                                <th className="p-4 font-medium text-sm text-gray-500">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map(r => (
                                <tr key={r.id} className="border-b border-gray-100 dark:border-gray-700">
                                    <td className="p-4 font-medium">{r.receiverId}</td>
                                    <td className="p-4">{r.type}</td>
                                    <td className="p-4 text-gray-500 text-sm">{new Date(r.timestamp).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            r.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                                            r.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {r.status.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {requests.length === 0 && (
                                <tr><td colSpan={4} className="p-8 text-center text-gray-500">No requests sent yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Post Requirement Modal */}
            {showPostModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-fade-in-up">
                        <h3 className="text-xl font-bold mb-4">Post Hiring Requirement</h3>
                        <form onSubmit={handlePostRequirement} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Type</label>
                                    <select className="w-full p-2 border rounded-lg" value={reqForm.hiringType} onChange={e => setReqForm({...reqForm, hiringType: e.target.value})}>
                                        <option value="Intern">Internship</option>
                                        <option value="Project">Project</option>
                                        <option value="Fulltime">Full Time</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Domain</label>
                                    <input className="w-full p-2 border rounded-lg" placeholder="AI, Web..." value={reqForm.domain} onChange={e => setReqForm({...reqForm, domain: e.target.value})} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Required Skills (Comma separated)</label>
                                <input className="w-full p-2 border rounded-lg" placeholder="React, Python..." value={reqForm.requiredSkills} onChange={e => setReqForm({...reqForm, requiredSkills: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Min Level / XP</label>
                                    <input type="number" className="w-full p-2 border rounded-lg" placeholder="2" value={reqForm.experienceNeeded} onChange={e => setReqForm({...reqForm, experienceNeeded: Number(e.target.value)})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Stipend</label>
                                    <input className="w-full p-2 border rounded-lg" placeholder="$500 / Unpaid" value={reqForm.stipend} onChange={e => setReqForm({...reqForm, stipend: e.target.value})} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea className="w-full p-2 border rounded-lg" rows={3} value={reqForm.projectDescription} onChange={e => setReqForm({...reqForm, projectDescription: e.target.value})} />
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button type="button" onClick={() => setShowPostModal(false)} className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="flex-1 py-2 bg-primary-600 text-white rounded-lg font-bold">Post</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
