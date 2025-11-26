import React from 'react';
import { Briefcase, Search, MessageCircle } from 'lucide-react';
import { MOCK_USERS } from '../../services/data';

export const ProfessionalDashboard: React.FC = () => {
    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-2xl font-bold">Professional Hub</h2>
                <p className="text-gray-500">Discover talent and mentor the next generation</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Talent Discovery */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                         <h3 className="text-lg font-bold flex items-center">
                            <Search className="mr-2 text-primary-600" size={20} />
                            Scout Talent
                        </h3>
                    </div>
                    
                    <div className="space-y-4">
                        {MOCK_USERS.map((student) => (
                            <div key={student.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center gap-4 hover:shadow-md transition-all">
                                <img src={student.photoURL} alt={student.name} className="w-12 h-12 rounded-full object-cover" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 dark:text-white">{student.name}</h4>
                                    <p className="text-xs text-gray-500 mb-1">{student.bio}</p>
                                    <div className="flex gap-1 flex-wrap">
                                        {student.skills.slice(0,3).map((skill, i) => (
                                            <span key={i} className="text-[10px] bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <button className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/50 rounded-full">
                                    <MessageCircle size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mentorship Hub */}
                <div>
                     <h3 className="text-lg font-bold flex items-center mb-4">
                        <Briefcase className="mr-2 text-primary-600" size={20} />
                        Mentorship Requests
                    </h3>
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl p-6 text-center">
                        <h4 className="font-bold text-xl mb-2">Open for Mentorship?</h4>
                        <p className="text-gray-300 text-sm mb-6">Students are looking for guidance in AI, Fintech, and Frontend Dev.</p>
                        <div className="flex justify-center gap-4">
                            <button className="bg-white text-gray-900 px-6 py-2 rounded-lg font-bold text-sm">
                                Accept Requests
                            </button>
                            <button className="bg-transparent border border-white/20 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-white/10">
                                Update Availability
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                         <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-4">Recent Inquiries</h4>
                         <div className="space-y-4">
                             <div className="flex gap-3 items-start">
                                 <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">JD</div>
                                 <div>
                                     <p className="text-sm font-medium">John Doe asked for code review</p>
                                     <p className="text-xs text-gray-500">2 hours ago • AI Track</p>
                                 </div>
                             </div>
                              <div className="flex gap-3 items-start">
                                 <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-bold text-xs">AS</div>
                                 <div>
                                     <p className="text-sm font-medium">Anna Smith requested career advice</p>
                                     <p className="text-xs text-gray-500">5 hours ago</p>
                                 </div>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};