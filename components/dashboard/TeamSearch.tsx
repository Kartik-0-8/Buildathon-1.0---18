import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchStudents } from '../../services/data';
import { computeMatchScore } from '../../lib/matchmaking';
import { UserProfile, MatchResult, StudentProfile } from '../../types';
import { Search, Filter, UserPlus, Zap, Check } from 'lucide-react';

export const TeamSearch: React.FC = () => {
    const { user } = useAuth();
    const [allStudents, setAllStudents] = useState<StudentProfile[]>([]);
    const [filteredResults, setFilteredResults] = useState<MatchResult[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [skillFilter, setSkillFilter] = useState('');
    const [interestFilter, setInterestFilter] = useState('');
    const [minXp, setMinXp] = useState<number>(0);
    const [invitedUsers, setInvitedUsers] = useState<Set<string>>(new Set());

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await fetchStudents();
            // Exclude current user and non-students
            const others = data.filter(u => u.id !== user?.id && u.role === 'student') as StudentProfile[];
            setAllStudents(others);
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

    const handleInvite = (userId: string) => {
        // Simulate API call
        setInvitedUsers(prev => new Set(prev).add(userId));
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Finding talent...</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Search className="mr-2 text-primary-600" /> Find Teammates
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search Name */}
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search name or bio..." 
                            className="w-full pl-10 pr-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    </div>

                    {/* Filter Skill */}
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Filter by skill (e.g. React)" 
                            className="w-full pl-10 pr-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 outline-none"
                            value={skillFilter}
                            onChange={(e) => setSkillFilter(e.target.value)}
                        />
                        <Filter className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    </div>

                    {/* Filter Interest */}
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Filter by interest (e.g. AI)" 
                            className="w-full pl-10 pr-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 outline-none"
                            value={interestFilter}
                            onChange={(e) => setInterestFilter(e.target.value)}
                        />
                        <Zap className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    </div>

                     {/* Min XP */}
                     <div>
                        <select 
                            className="w-full px-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 outline-none"
                            value={minXp}
                            onChange={(e) => setMinXp(Number(e.target.value))}
                        >
                            <option value={0}>Any XP Level</option>
                            <option value={100}>100+ XP</option>
                            <option value={300}>300+ XP</option>
                            <option value={500}>500+ XP</option>
                            <option value={1000}>1000+ XP</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResults.length > 0 ? (
                    filteredResults.map(({ user: candidate, score }) => {
                        const isInvited = invitedUsers.has(candidate.id);
                        return (
                            <div key={candidate.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-3">
                                    <span className={`inline-block px-2 py-1 text-xs font-bold rounded-full ${score > 70 ? 'bg-green-100 text-green-700' : score > 40 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {score}% Match
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 mb-4">
                                    <img src={candidate.photoURL} alt={candidate.name} className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 dark:border-gray-700" />
                                    <div>
                                        <h4 className="font-bold text-lg">{candidate.name}</h4>
                                        <p className="text-xs text-primary-600 font-medium">Lvl {candidate.level} • {candidate.xp} XP</p>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 h-10 line-clamp-2">{candidate.bio}</p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {candidate.skills.slice(0, 3).map((skill, i) => (
                                        <span key={i} className="px-2 py-1 bg-gray-50 dark:bg-gray-700 text-xs rounded text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-600">
                                            {skill}
                                        </span>
                                    ))}
                                    {candidate.skills.length > 3 && <span className="text-xs text-gray-400 self-center">+{candidate.skills.length - 3}</span>}
                                </div>

                                <button 
                                    onClick={() => handleInvite(candidate.id)}
                                    disabled={isInvited}
                                    className={`w-full py-2 rounded-lg font-bold text-sm flex items-center justify-center transition-colors ${
                                        isInvited 
                                        ? 'bg-green-50 text-green-600 border border-green-200 cursor-default' 
                                        : 'bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/30 dark:hover:bg-primary-900/50'
                                    }`}
                                >
                                    {isInvited ? (
                                        <>
                                            <Check size={16} className="mr-2" /> Invited
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus size={16} className="mr-2" /> Invite to Team
                                        </>
                                    )}
                                </button>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full text-center py-12 text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-dashed border-2 border-gray-200 dark:border-gray-700">
                        <p>No students found matching your filters.</p>
                        <button 
                            onClick={() => { setSearchTerm(''); setSkillFilter(''); setInterestFilter(''); setMinXp(0); }}
                            className="mt-2 text-primary-600 font-medium hover:underline"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};