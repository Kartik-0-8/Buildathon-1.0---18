
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchHackathons, fetchStudents, fetchTeamMembers, fetchLeaderboard } from '../../services/data';
import { generateBio, suggestBadges, getMatchAnalysis } from '../../services/geminiService';
import { computeMatchScore } from '../../lib/matchmaking';
import { Hackathon, UserProfile, MatchResult, StudentProfile } from '../../types';
import { Trophy, Star, Zap, Code, Users, Award, Wand2, RefreshCw, MessageCircle, BarChart2, TrendingUp, Sparkles, X, ChevronRight, MapPin, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TeamSearch } from './TeamSearch';
import { AICoachChat } from './AICoachChat';

export const StudentDashboard: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'leaderboard' | 'search'>('overview');
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [teamMembers, setTeamMembers] = useState<UserProfile[]>([]);
  const [leaderboard, setLeaderboard] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [generatingBio, setGeneratingBio] = useState(false);
  const [suggestingBadges, setSuggestingBadges] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<Set<string>>(new Set());
  
  // AI State
  const [showAiChat, setShowAiChat] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState<string | null>(null);
  const [matchAnalysis, setMatchAnalysis] = useState<{id: string, text: string} | null>(null);

  // Helper cast for JSX since this dashboard is protected for students
  const studentUser = user?.role === 'student' ? (user as StudentProfile) : null;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [hacks, team, lb] = await Promise.all([
          fetchHackathons(),
          fetchTeamMembers(),
          fetchLeaderboard()
      ]);
      setHackathons(hacks);
      setTeamMembers(team);
      
      // Simulation: Ensure current user is in the leaderboard for ranking display
      let updatedLb = [...lb];
      if (user && !updatedLb.find(u => u.id === user.id)) {
           updatedLb.push(user);
      }
      updatedLb.sort((a, b) => {
          const ratingA = a.role === 'student' ? a.rating : 0;
          const ratingB = b.role === 'student' ? b.rating : 0;
          return ratingB - ratingA;
      });
      setLeaderboard(updatedLb);

      if (user && user.role === 'student') {
        const allStudents = (await fetchStudents()).filter(u => u.role === 'student') as StudentProfile[];
        const scoredMatches = allStudents
          .filter(u => u.id !== user.id)
          .map(other => ({
            user: other,
            score: computeMatchScore(user as StudentProfile, other)
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 4); // Top 4
        setMatches(scoredMatches);
      }
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

  const handleSuggestBadges = async () => {
    if (!studentUser) return;
    setSuggestingBadges(true);
    const newBadges = await suggestBadges(studentUser.skills, studentUser.xp);
    updateProfile({ badges: [...new Set([...studentUser.badges, ...newBadges])] });
    setSuggestingBadges(false);
  }

  const handleAnalyzeMatch = async (matchUser: UserProfile) => {
    if (!user) return;
    setAnalysisLoading(matchUser.id);
    const text = await getMatchAnalysis(user, matchUser);
    setMatchAnalysis({ id: matchUser.id, text });
    setAnalysisLoading(null);
  }

  const handleConnect = (userId: string) => {
      setConnectedUsers(prev => new Set(prev).add(userId));
  }

  // Calculate User Rank
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
               <span className="text-gray-500 dark:text-gray-400 font-medium ml-1">Lvl {studentUser?.level} • {studentUser?.xp} XP</span>
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

            <div className="mt-4">
                <div className="flex flex-wrap gap-2 justify-center md:justify-start items-center">
                    {studentUser?.badges.map((badge, idx) => (
                        <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        <Award size={12} className="mr-1" />
                        {badge}
                        </span>
                    ))}
                    <button 
                        onClick={handleSuggestBadges}
                        disabled={suggestingBadges}
                        className="p-1 rounded-full text-gray-400 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="Auto-discover badges"
                    >
                         <RefreshCw size={14} className={suggestingBadges ? "animate-spin" : ""} />
                    </button>
                </div>
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
                    <p className="text-sm text-gray-500 mt-1 flex items-center">
                        Registered events <ChevronRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"/>
                    </p>
                </div>
                <div 
                    onClick={() => navigate('/team')}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-all group"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg">Team Requests</h3>
                        <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-600 group-hover:scale-110 transition-transform">
                            <Users size={20} />
                        </div>
                    </div>
                    <p className="text-3xl font-bold">5</p>
                    <p className="text-sm text-gray-500 mt-1 flex items-center">
                        Pending invitations <ChevronRight size={14} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"/>
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
                {/* Find Team Match */}
                <div className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                         <h3 className="text-xl font-bold flex items-center">
                            <Sparkles className="mr-2 text-primary-600" />
                            AI Recommended Matches
                        </h3>
                        <button onClick={() => setActiveTab('search')} className="text-sm text-primary-600 font-medium hover:underline">
                            View All
                        </button>
                    </div>
                   
                    <div className="grid grid-cols-1 gap-4">
                        {matches.map(({ user: matchUser, score }) => {
                            const matchStudent = matchUser as StudentProfile;
                            const isConnected = connectedUsers.has(matchUser.id);
                            return (
                                <div key={matchUser.id} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                        <div className="relative shrink-0">
                                            <img src={matchUser.photoURL} alt={matchUser.name} className="w-16 h-16 rounded-full object-cover" />
                                            <span className={`absolute -bottom-1 -right-1 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-gray-800 ${score > 80 ? 'bg-green-500' : score > 60 ? 'bg-yellow-500' : 'bg-gray-400'}`}>
                                                {score}%
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white text-lg flex items-center">
                                                        {matchUser.name}
                                                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${score > 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                                                            {score}% Match
                                                        </span>
                                                    </h4>
                                                    <p className="text-xs text-primary-600 font-medium mb-1">Rating: {matchStudent.rating}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => handleAnalyzeMatch(matchUser)}
                                                        disabled={analysisLoading === matchUser.id}
                                                        className="px-3 py-2 text-primary-600 bg-primary-50 dark:bg-primary-900/30 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors flex items-center gap-2 text-xs font-bold"
                                                        title="Analyze Compatibility with AI"
                                                    >
                                                        {analysisLoading === matchUser.id ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                                                        Analyze
                                                    </button>
                                                    <button 
                                                        onClick={() => handleConnect(matchUser.id)}
                                                        disabled={isConnected}
                                                        className={`py-2 px-4 text-sm font-bold rounded-lg transition-colors min-w-[100px] ${
                                                            isConnected 
                                                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 cursor-default' 
                                                            : 'bg-primary-600 text-white hover:bg-primary-700'
                                                        }`}
                                                    >
                                                        {isConnected ? 'Request Sent' : 'Connect'}
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-2 truncate">{matchUser.bio}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {matchStudent.skills?.slice(0, 4).map((skill, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    {/* AI Analysis Result */}
                                    {matchAnalysis?.id === matchUser.id && (
                                        <div className="mt-4 p-3 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-gray-700 dark:to-gray-700 rounded-lg border border-primary-100 dark:border-gray-600 text-sm animate-fade-in relative">
                                            <button onClick={() => setMatchAnalysis(null)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"><X size={14}/></button>
                                            <div className="flex gap-2">
                                                <Sparkles size={16} className="text-primary-600 shrink-0 mt-0.5" />
                                                <p className="text-gray-700 dark:text-gray-200">{matchAnalysis.text}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Your Team */}
                <div>
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
                                <button className="text-gray-400 hover:text-primary-600">
                                    <MessageCircle size={18} />
                                </button>
                            </div>
                        )) : (
                            <p className="text-gray-500 text-sm text-center py-4">No team members yet.</p>
                        )}
                        <button className="w-full py-2 text-sm font-medium text-primary-600 border border-primary-200 dark:border-gray-600 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-700">
                            Manage Team
                        </button>
                    </div>
                </div>
            </div>

            {/* Hackathon Carousel */}
            <div>
                <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Trophy className="mr-2 text-purple-500" />
                    Upcoming Hackathons
                </h3>
                <div className="flex gap-6 overflow-x-auto pb-4 snap-x no-scrollbar">
                    {hackathons.map((hack) => (
                        <div key={hack.id} className="min-w-[300px] bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 snap-center shadow-sm hover:shadow-md transition-all">
                            <div className="h-32 overflow-hidden">
                                <img src={hack.image} alt={hack.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-4">
                                <div className="mb-2">
                                    <h4 className="font-bold text-lg leading-tight mb-1">{hack.title}</h4>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <span className="flex items-center"><MapPin size={12} className="mr-1"/> {hack.location}</span>
                                        <span>•</span>
                                        <span>{hack.date}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{hack.description}</p>
                                <button className="w-full py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg text-sm hover:opacity-90">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}

      {activeTab === 'search' && (
          <div className="animate-fade-in">
              <TeamSearch />
          </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="animate-fade-in bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
             <div className="p-6 bg-gradient-to-r from-primary-600 to-purple-600 text-white">
                 <h3 className="text-2xl font-bold flex items-center">
                     <TrendingUp className="mr-2" /> Global Leaderboard
                 </h3>
                 <p className="opacity-80">Top rated students based on hackathon performance and skill assessments.</p>
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
                             <th className="px-6 py-4 font-medium text-right">Action</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                         {leaderboard.map((lbUser, index) => {
                             const lbStudent = lbUser as StudentProfile;
                             const isCurrentUser = lbUser.id === user?.id;
                             return (
                                <tr key={lbUser.id} className={`${isCurrentUser ? 'bg-primary-50 dark:bg-primary-900/20 ring-1 ring-inset ring-primary-500/30' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'} transition-colors`}>
                                    <td className="px-6 py-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                            index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                            index === 1 ? 'bg-gray-100 text-gray-700' :
                                            index === 2 ? 'bg-orange-100 text-orange-700' :
                                            'text-gray-500'
                                        }`}>
                                            {index + 1}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={lbUser.photoURL} alt="" className="w-10 h-10 rounded-full object-cover" />
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                    {lbUser.name}
                                                    {isCurrentUser && <span className="text-xs bg-primary-600 text-white px-2 py-0.5 rounded-full">You</span>}
                                                </p>
                                                <p className="text-xs text-gray-500">{lbUser.role}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center text-primary-600 font-bold">
                                            <Zap size={16} className="mr-1" />
                                            {lbStudent.rating || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                                        Lvl {lbStudent.level || 1}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex -space-x-1">
                                            {lbStudent.badges?.slice(0, 3).map((b, i) => (
                                                <div key={i} title={b} className="w-6 h-6 rounded-full bg-yellow-100 border border-white dark:border-gray-800 flex items-center justify-center text-[10px] text-yellow-800 cursor-help">
                                                    <Award size={12} />
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {!isCurrentUser && (
                                            <button className="text-sm font-medium text-gray-500 hover:text-primary-600">View Profile</button>
                                        )}
                                    </td>
                                </tr>
                             );
                         })}
                     </tbody>
                 </table>
             </div>
        </div>
      )}

      {/* AI Chat Modal */}
      {showAiChat && user && (
          <AICoachChat user={user} onClose={() => setShowAiChat(false)} />
      )}
    </div>
  );
};
