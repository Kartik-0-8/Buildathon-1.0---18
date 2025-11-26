
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchStudents, sendHiringRequest } from '../../services/data';
import { computeHiringMatchScore } from '../../lib/matchmaking';
import { UserProfile, StudentProfile, ProfessionalProfile } from '../../types';
import { Search, Filter, Briefcase, Zap, MapPin, X, Check, Award, Clock } from 'lucide-react';

export const TalentSearch: React.FC = () => {
    const { user } = useAuth();
    const [allStudents, setAllStudents] = useState<StudentProfile[]>([]);
    const [filteredResults, setFilteredResults] = useState<{user: StudentProfile, score: number}[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [skillFilter, setSkillFilter] = useState('');
    const [interestFilter, setInterestFilter] = useState('');
    const [minLevel, setMinLevel] = useState(0);

    // Modal
    const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);
    const [requestSent, setRequestSent] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await fetchStudents();
            const students = data.filter(u => u.role === 'student') as StudentProfile[];
            setAllStudents(students);
            setLoading(false);
        };
        load();
    }, []);

    useEffect(() => {
        if (!user || user.role !== 'professional') return;
        const prof = user as ProfessionalProfile;

        let results = allStudents.map(student => ({
            user: student,
            score: computeHiringMatchScore(prof, student)
        }));

        if (skillFilter) {
            results = results.filter(r => r.user.skills.some(s => s.toLowerCase().includes(skillFilter.toLowerCase())));
        }
        if (interestFilter) {
            results = results.filter(r => r.user.interests.some(i => i.toLowerCase().includes(interestFilter.toLowerCase())));
        }
        if (minLevel > 0) {
            results = results.filter(r => r.user.level >= minLevel);
        }

        results.sort((a, b) => b.score - a.score);
        setFilteredResults(results);
    }, [user, allStudents, skillFilter, interestFilter, minLevel]);

    const handleSendRequest = async (type: 'Internship' | 'Project' | 'Fulltime') => {
        if (!user || !selectedStudent) return;
        const prof = user as ProfessionalProfile;
        
        await sendHiringRequest({
            senderId: prof.id,
            senderName: prof.name,
            senderCompany: prof.company,
            receiverId: selectedStudent.id,
            type: type,
            jobDetails: prof.hiringRequirements?.projectDescription || 'Invitation to connect',
        });
        
        setRequestSent(true);
        setTimeout(() => {
            setSelectedStudent(null);
            setRequestSent(false);
        }, 1500);
    };

    if (loading) return <div className="p-8 text-center">Loading Talent...</div>;

    return (
        <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                        <input className="w-full pl-10 p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600" placeholder="Filter by Skills..." value={skillFilter} onChange={e => setSkillFilter(e.target.value)} />
                    </div>
                    <div className="relative">
                        <Zap className="absolute left-3 top-2.5 text-gray-400" size={18}/>
                        <input className="w-full pl-10 p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600" placeholder="Filter by Interest..." value={interestFilter} onChange={e => setInterestFilter(e.target.value)} />
                    </div>
                    <div>
                        <select className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600" value={minLevel} onChange={e => setMinLevel(Number(e.target.value))}>
                            <option value={0}>Any Level</option>
                            <option value={2}>Level 2+</option>
                            <option value={5}>Level 5+</option>
                            <option value={8}>Level 8+</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResults.map(({ user: student, score }) => (
                    <div key={student.id} onClick={() => setSelectedStudent(student)} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2">
                             <span className={`px-2 py-1 rounded-lg text-xs font-bold ${score > 70 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                 {score}% Match
                             </span>
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            <img src={student.photoURL} className="w-16 h-16 rounded-full object-cover" alt="" />
                            <div>
                                <h4 className="font-bold text-lg">{student.name}</h4>
                                <p className="text-xs text-primary-600">Lvl {student.level} • {student.xp} XP</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{student.bio}</p>
                        <div className="flex flex-wrap gap-2">
                            {student.skills.slice(0,3).map(s => (
                                <span key={s} className="px-2 py-1 bg-gray-50 dark:bg-gray-700 text-xs rounded border border-gray-200 dark:border-gray-600">{s}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Student Detail Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
                        <div className="bg-gradient-to-r from-primary-600 to-blue-600 h-32 relative">
                            <button onClick={() => setSelectedStudent(null)} className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full"><X size={20}/></button>
                        </div>
                        <div className="px-8 pb-8">
                            <div className="relative -top-12 flex justify-between items-end">
                                <img src={selectedStudent.photoURL} className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800" alt="" />
                                <div className="flex gap-2 mb-2">
                                     {requestSent ? (
                                         <button disabled className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold flex items-center"><Check size={18} className="mr-2"/> Sent</button>
                                     ) : (
                                        <>
                                            <button onClick={() => handleSendRequest('Internship')} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 text-sm">Send Internship</button>
                                            <button onClick={() => handleSendRequest('Project')} className="bg-primary-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-primary-700 text-sm">Project Request</button>
                                        </>
                                     )}
                                </div>
                            </div>
                            
                            <div className="mt-[-2rem]">
                                <h2 className="text-2xl font-bold">{selectedStudent.name}</h2>
                                <p className="text-gray-500">{selectedStudent.bio}</p>
                                
                                <div className="grid grid-cols-3 gap-4 mt-6">
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl text-center">
                                        <Award className="mx-auto text-yellow-500 mb-2" />
                                        <div className="font-bold">{selectedStudent.level}</div>
                                        <div className="text-xs text-gray-500">Level</div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl text-center">
                                        <Zap className="mx-auto text-primary-500 mb-2" />
                                        <div className="font-bold">{selectedStudent.rating}</div>
                                        <div className="text-xs text-gray-500">Rating</div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl text-center">
                                        <Clock className="mx-auto text-green-500 mb-2" />
                                        <div className="font-bold">{selectedStudent.xp}</div>
                                        <div className="text-xs text-gray-500">Total XP</div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h4 className="font-bold mb-2">Skills</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedStudent.skills.map(s => (
                                            <span key={s} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">{s}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h4 className="font-bold mb-2">Badges</h4>
                                    <div className="flex gap-2">
                                        {selectedStudent.badges.map(b => (
                                            <span key={b} className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded border border-yellow-200">{b}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
