
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchStudents, sendTeamRequest, fetchSentTeamRequests } from '../../services/data';
import { computeMatchScore } from '../../lib/matchmaking';
import { UserProfile, MatchResult, StudentProfile } from '../../types';
import { Search, Filter, UserPlus, Zap, Check, Clock, Award } from 'lucide-react';

export const TeamSearch: React.FC = () => {
    const { user } = useAuth();
    const [allStudents, setAllStudents] = useState<StudentProfile[]>([]);
    const [filteredResults, setFilteredResults] = useState<MatchResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [skillFilter, setSkillFilter] = useState('');
    const [interestFilter, setInterestFilter] = useState('');
    const [minXp, setMinXp] = useState<number>(0);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const [data, reqs] = await Promise.all([
                fetchStudents(),
                user ? fetchSentTeamRequests(user.id) : Promise.resolve([])
            ]);

            // Exclude current user and non-students
            const others = data.filter(u => u.id !== user?.id && u.role === 'student') as StudentProfile[];
            setAllStudents(others);
            
            // Mark pending requests
            const pendingIds = reqs.map(r => r.receiverId);
            setSentRequests(new Set(pendingIds));
            
            setLoading(false);
        };
        load();
    }, [user]);

    useEffect(() => {
        if (!user || user.role !== 'student') return;
        const studentUser = user as StudentProfile;

        let results = allStudents.map(student => ({
            user: student,
            score: computeMatchScore(studentUser, student)
        }));

        // Filter: Search Term (Name/Bio)
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            results = results.filter(r => 
                r.user.name.toLowerCase().includes(term) || 
                r.user.bio.toLowerCase().includes(term)
            );
        }

        // Filter: Skill
        if (skillFilter) {
            const term = skillFilter.toLowerCase();
            results = results.filter(r => 
                r.user.skills.some(s => s.toLowerCase().includes(term))
            );
        }

        // Filter: Interest
        if (interestFilter) {
            const term = interestFilter.toLowerCase();
            results = results.filter(r => 
                r.user.interests.some(i => i.toLowerCase().includes(term))
            );
        }

        // Filter: XP
        if (minXp > 0) {
            results = results.filter(r => r.user.xp >= minXp);
        }

        // Sort by Match Score (Desc)
        results.sort((a, b) => b.score - a.score);

        setFilteredResults(results);

    }, [user, allStudents, searchTerm, skillFilter, interestFilter, minXp]);

    const handleInvite = async (candidateId: string) => {
        if (!user || user.role !== 'student') return;
        try {
            await sendTeamRequest(user as StudentProfile, candidateId);
            setSentRequests(prev => {
                const newSet = new Set(prev);
                newSet.add(candidateId);
                return newSet;
            });
        } catch (error) {
            console.error(error);
            alert("Could not send request or request already pending.");
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Finding talent...</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-white">
                    <Search className="mr-2 text-primary-600" /> Find Teammates
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search Name */}
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search name or bio..." 
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    </div>

                    {/* Filter Skills */}
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Filter by skill..." 
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                            value={skillFilter}
                            onChange={(e) => setSkillFilter(e.target.value)}
                        />
                        <Filter className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    </div>

                    {/* Filter Interests */}
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Filter by interest..." 
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                            value={interestFilter}
                            onChange={(e) => setInterestFilter(e.target.value)}
                        />
                        <Zap className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    </div>

                    {/* Min XP */}
                    <div>
                        <select 
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 outline-none text-sm appearance-none cursor-pointer"
                            value={minXp}
                            onChange={(e) => setMinXp(Number(e.target.value))}
                        >
                            <option value={0}>Any Experience Level</option>
                            <option value={200}>200+ XP</option>
                            <option value={500}>500+ XP</option>
                            <option value={1000}>1000+ XP (Expert)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResults.map(({ user: student, score }) => {
                    const isSent = sentRequests.has(student.id);
                    return (
                        <div key={student.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all relative overflow-hidden group">
                            {/* Match Score Badge */}
                            <div className="absolute top-0 right-0 p-2 z-10">
                                <span className={`px-2 py-1 rounded-lg text-xs font-bold shadow-sm ${
                                    score >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' :
                                    score >= 50 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' :
                                    'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                                }`}>
                                    {score}% Match
                                </span>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <img 
                                    src={student.photoURL} 
                                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 dark:border-gray-700" 
                                    alt={student.name} 
                                />
                                <div>
                                    <h4 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">{student.name}</h4>
                                    <div className="flex items-center text-xs text-primary-600 dark:text-primary-400 font-medium mt-1">
                                        <Award size={12} className="mr-1" />
                                        Lvl {student.level}
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 h-10">
                                {student.bio || "No bio provided."}
                            </p>

                            <div className="space-y-3 mb-6">
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Top Skills</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {student.skills.slice(0, 3).map(s => (
                                            <span key={s} className="px-2 py-1 bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 text-xs rounded border border-gray-100 dark:border-gray-600">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => !isSent && handleInvite(student.id)}
                                disabled={isSent}
                                className={`w-full py-2.5 rounded-lg font-bold text-sm flex items-center justify-center transition-all ${
                                    isSent 
                                    ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 cursor-default' 
                                    : 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-600/20'
                                }`}
                            >
                                {isSent ? (
                                    <>
                                        <Check size={18} className="mr-2" /> Request Sent
                                    </>
                                ) : (
                                    <>
                                        <UserPlus size={18} className="mr-2" /> Send Team Request
                                    </>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
            
            {filteredResults.length === 0 && (
                <div className="text-center py-20 opacity-50">
                    <Search className="mx-auto h-12 w-12 mb-4" />
                    <p className="text-lg font-medium">No students found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};
