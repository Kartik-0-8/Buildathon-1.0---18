
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchHackathons, fetchTeamMembers, fetchLeaderboard, fetchTeamRequests, respondToTeamRequest } from '../../services/data';
import { generateBio, suggestBadges } from '../../services/geminiService';
import { Hackathon, UserProfile, StudentProfile, TeamRequest } from '../../types';
import { Trophy, Star, Zap, Code, Users, Wand2, BarChart2, TrendingUp, X, ChevronRight, Search, Bell, Check, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TeamSearch } from './TeamSearch';
import { AICoachChat } from './AICoachChat';

export const StudentDashboard: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'leaderboard' | 'search' | 'requests'>('overview');
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [teamMembers, setTeamMembers] = useState<UserProfile[]>([]);
  const [leaderboard, setLeaderboard] = useState<UserProfile[]>([]);
  const [teamRequests, setTeamRequests] = useState<TeamRequest[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [generatingBio, setGeneratingBio] = useState(false);
  const [showAiChat, setShowAiChat] = useState(false);

  const studentUser = user?.role === 'student' ? (user as StudentProfile) : null;

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      setLoading(true);
      
      const [hacks, lb, reqs] = await Promise.all([
          fetchHackathons(),
          fetchLeaderboard(),
          fetchTeamRequests(user.id)
      ]);
      
      setHackathons(hacks);
      setLeaderboard(lb);
      setTeamRequests(reqs);

      // Fetch Team Members if user has teamId
      const team = await fetchTeamMembers(user.id);
      setTeamMembers(team);

      setLoading(false);
    };
    loadData();
  }, [user]);

  const handleGenerateBio = async () => {
    if (!studentUser) return;
    setGeneratingBio(true);
    const newBio = await generateBio(studentUser.skills, studentUser.interests, studentUser.role);
    updateProfile({ bio: newBio });
    setGeneratingBio(false);
  };

  const handleRespondRequest = async (req: TeamRequest, action: 'accept' | 'decline') => {
      const teamId = await respondToTeamRequest(req.id, action);
      
      if (action === 'accept' && teamId) {
          // Update profile locally to reflect new team
          updateProfile({ teamId });
          navigate('/team'); // Instant redirect to team chat
          return;
      }
      
      // Refresh requests list if declined
      setTeamRequests(prev => prev.filter(r => r.id !== req.id));
  };

  const userRank = user ? leaderboard.findIndex(u => u.id === user.id) + 1 : 0;

  if (loading) return <div className="flex h-96 items-center justify-center text-primary-600"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Trophy size={120} />
        </div>
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start relative z-10">
          <img src={user?.photoURL} alt="Profile" className="w-24 h-24 rounded-full border-4 border-primary-100 dark:border-primary-900 object-cover" />
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2 text-sm">
               <span className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full font-bold flex items-center">
                 <Zap size={14} className="mr-1" /> {studentUser?.rating || 1000} Rating
               </span>
               {userRank > 0 && (
                   <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-3 py-1 rounded-full font-bold flex items-center border border-yellow-200 dark:border-yellow-700/50">
                     <Trophy size={14} className="mr-1" /> Global Rank #{userRank}
                   </span>
               )}
            </div>
            
            <div className="mt-4 max-w-2xl">
                <p className="text-gray-600 dark:text-gray-300 italic">"{user?.bio || "No bio yet."}"</p>
                <button 
                    onClick={handleGenerateBio} 
                    disabled={generatingBio}
                    className="mt-2 text-xs flex items-center text-primary-600 hover:text-primary-700 disabled:opacity-50"
                >
                    <Wand2 size={12} className="mr-1" />
                    {generatingBio ? 'Generating...' : 'Rewrite with AI'}
                </button>
            </div>
          </div>
          
          <div className="w-full md:w-64 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
             <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">XP Progress</span>
                <span className="text-xs text-gray-500">{(studentUser?.xp || 0) % 1000} / 1000</span>
             </div>
             <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 mb-2">
                <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${((studentUser?.xp || 0) % 1000) / 10}%` }}></div>
             </div>
             <div className="text-xs text-gray-500 text-center">Next Level: {((studentUser?.level || 1) + 1)}</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <button 
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${activeTab === 'overview' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
            Overview
        </button>
        <button 
            onClick={() => setActiveTab('search')}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap flex items-center ${activeTab === 'search' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
            <Search size={16} className="mr-2" />
            Find Teammates
        </button>
        <button 
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap flex items-center ${activeTab === 'requests' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
            <Bell size={16} className="mr-2" />
            Requests
            {teamRequests.length > 0 && <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{teamRequests.length}</span>}
        </button>
        <button 
            onClick={() => setActiveTab('leaderboard')}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap flex items-center ${activeTab === 'leaderboard' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
            <BarChart2 size={16} className="mr-2" />
            Global Leaderboard
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fade-in">
             {/* Engagement Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div 
                    onClick={() => navigate('/hackathons')}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-all group"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">Active Hackathons</h3>
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 group-hover:scale-110 transition-transform">
                            <Code size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold">{hackathons.length}</p>
                </div>
                <div 
                    onClick={() => setActiveTab('requests')}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-all group"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">Team Requests</h3>
                        <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-600 group-hover:scale-110 transition-transform">
                            <Users size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold">{teamRequests.length}</p>
                    <p className="text-sm text-gray-500 mt-1 flex items-center">
                        {teamRequests.length > 0 ? 'Pending actions' : 'No pending requests'} <ChevronRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"/>
                    </p>
                </div>
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-xl shadow-md">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg flex items-center"><Zap className="mr-2" size={18}/> AI Coach</h3>
                    </div>
                    <div className="text-center py-4">
                        <p className="text-sm opacity-90 mb-3">Get personalized tips to level up.</p>
                        <button 
                            onClick={() => setShowAiChat(true)} 
                            className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors"
                        >
                            Ask AI
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Your Team */}
                <div className="lg:col-span-2">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                        <Star className="mr-2 text-yellow-500" />
                        Your Team
                    </h3>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 space-y-4">
                        {teamMembers.length > 0 ? teamMembers.map(member => (
                            <div key={member.id} className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                                <img src={member.photoURL} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                                <div className="flex-1">
                                    <p className="text-sm font-bold">{member.name}</p>
                                    <p className="text-xs text-gray-500">{member.role}</p>
                                </div>
                                <button onClick={() => navigate('/team')} className="text-gray-400 hover:text-primary-600">
                                    <MessageCircle size={18} />
                                </button>
                            </div>
                        )) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500 text-sm mb-3">You haven't joined a team yet.</p>
                                <button onClick={() => setActiveTab('search')} className="text-primary-600 text-sm font-bold hover:underline">Find Teammates</button>
                            </div>
                        )}
                        {teamMembers.length > 0 && (
                             <button onClick={() => navigate('/team')} className="w-full py-2 text-sm font-medium text-primary-600 border border-primary-200 dark:border-gray-600 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-700">
                                Go to Team Chat
                            </button>
                        )}
                    </div>
                </div>
                
                {/* Hackathon Carousel */}
                <div className="lg:col-span-1">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                        <Trophy className="mr-2 text-purple-500" />
                        Upcoming
                    </h3>
                    <div className="space-y-4">
                        {hackathons.slice(0, 2).map((hack) => (
                            <div key={hack.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm">
                                <div className="h-24 overflow-hidden">
                                    <img src={hack.image} alt={hack.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-3">
                                    <h4 className="font-bold text-sm leading-tight mb-1">{hack.title}</h4>
                                    <p className="text-xs text-gray-500">{hack.date}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}

      {activeTab === 'search' && (
          <div className="animate-fade-in">
              <TeamSearch />
          </div>
      )}

      {activeTab === 'requests' && (
          <div className="animate-fade-in">
              <h3 className="text-xl font-bold mb-6">Pending Invitations</h3>
              {teamRequests.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {teamRequests.map(req => (
                          <div key={req.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                              <img src={req.senderPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${req.senderId}`} alt="Sender" className="w-12 h-12 rounded-full" />
                              <div className="flex-1">
                                  <p className="font-bold text-gray-900 dark:text-white">{req.senderName}</p>
                                  <p className="text-xs text-gray-500">wants to join your team</p>
                              </div>
                              <div className="flex gap-2">
                                  <button 
                                    onClick={() => handleRespondRequest(req, 'accept')}
                                    className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200" title="Accept">
                                      <Check size={18} />
                                  </button>
                                  <button 
                                    onClick={() => handleRespondRequest(req, 'decline')}
                                    className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200" title="Decline">
                                      <X size={18} />
                                  </button>
                              </div>
                          </div>
                      ))}
                  </div>
              ) : (
                  <div className="bg-white dark:bg-gray-800 p-12 rounded-xl text-center border border-gray-100 dark:border-gray-700">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                          <Bell size={24} />
                      </div>
                      <h3 className="font-bold text-lg mb-1">No pending requests</h3>
                      <p className="text-gray-500">When someone invites you, it will appear here.</p>
                  </div>
              )}
          </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="animate-fade-in bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
             <div className="p-6 bg-gradient-to-r from-primary-600 to-purple-600 text-white">
                 <h3 className="text-2xl font-bold flex items-center">
                     <TrendingUp className="mr-2" /> Global Leaderboard
                 </h3>
             </div>
             <div className="overflow-x-auto">
                 <table className="w-full text-left">
                     <thead>
                         <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-100 dark:border-gray-700">
                             <th className="px-6 py-4 font-medium">Rank</th>
                             <th className="px-6 py-4 font-medium">Participant</th>
                             <th className="px-6 py-4 font-medium">Rating</th>
                             <th className="px-6 py-4 font-medium">Level</th>
                             <th className="px-6 py-4 font-medium">Top Badges</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                         {leaderboard.map((lbUser, index) => {
                             const lbStudent = lbUser as StudentProfile;
                             return (
                                 <tr key={lbUser.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                     <td className="px-6 py-4 font-bold text-gray-500">#{index + 1}</td>
                                     <td className="px-6 py-4 flex items-center">
                                         <img src={lbUser.photoURL} alt={lbUser.name} className="w-8 h-8 rounded-full mr-3" />
                                         <span className="font-semibold">{lbUser.name}</span>
                                     </td>
                                     <td className="px-6 py-4 text-primary-600 font-bold">{lbStudent.rating}</td>
                                     <td className="px-6 py-4">{lbStudent.level}</td>
                                     <td className="px-6 py-4">
                                         <div className="flex gap-1">
                                             {lbStudent.badges?.slice(0, 2).map(b => (
                                                 <span key={b} className="text-[10px] bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-1.5 py-0.5 rounded border border-yellow-200 dark:border-yellow-700/50">{b}</span>
                                             ))}
                                         </div>
                                     </td>
                                 </tr>
                             );
                         })}
                     </tbody>
                 </table>
             </div>
        </div>
      )}

      {showAiChat && user && (
          <AICoachChat user={user} onClose={() => setShowAiChat(false)} />
      )}
    </div>
  );
};
