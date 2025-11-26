import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Briefcase, Calendar, Lock, Mail, ArrowLeft, ArrowRight, Zap, CheckCircle, Home } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { login, signup, resetPassword, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Initialize view based on URL
  const [view, setView] = useState<'login' | 'signup' | 'forgot'>(() => 
    location.pathname.includes('signup') ? 'signup' : 'login'
  );
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [message, setMessage] = useState('');

  // Sync state with URL changes (e.g. back button)
  useEffect(() => {
    if (location.pathname.includes('signup')) {
        setView('signup');
    } else if (location.pathname.includes('login')) {
        // Only force to login if we are currently in signup mode. 
        // We preserve 'forgot' state if the user is already there on the /login route.
        if (view === 'signup') {
            setView('login');
        }
    }
  }, [location.pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    
    if (view === 'forgot') {
      await resetPassword(email);
      setMessage('Check your email for reset instructions.');
      setTimeout(() => setView('login'), 3000);
      return;
    }

    if (view === 'login') {
      const roleToUse = email.includes('org') ? 'organizer' : email.includes('pro') ? 'professional' : 'student';
      await login(email, roleToUse);
    } else {
      if (!selectedRole) return;
      await signup(email, password, selectedRole, name);
    }
  };

  const roles = [
    { 
        id: 'student', 
        icon: User, 
        label: 'Student', 
        desc: 'Join hackathons, find teams, and earn badges.',
        color: 'text-blue-500', 
        bg: 'bg-blue-50' 
    },
    { 
        id: 'organizer', 
        icon: Calendar, 
        label: 'Organizer', 
        desc: 'Create events, manage submissions, and analytics.',
        color: 'text-purple-500', 
        bg: 'bg-purple-50' 
    },
    { 
        id: 'professional', 
        icon: Briefcase, 
        label: 'Professional', 
        desc: 'Mentor students and scout top talent.',
        color: 'text-green-500', 
        bg: 'bg-green-50' 
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex font-sans">
      
      {/* Left Panel - Visual (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden text-white items-center justify-center p-12">
        <div className="absolute inset-0 z-0">
             <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
             <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
             <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-gray-800/90 backdrop-blur-[1px]"></div>
             {/* Updated Image to a Person */}
             <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Professional Developer" className="w-full h-full object-cover opacity-30 mix-blend-overlay" />
        </div>

        <div className="relative z-10 max-w-lg">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-primary-500/30">
                <span className="font-bold text-2xl">C</span>
            </div>
            <h1 className="text-5xl font-extrabold mb-6 leading-tight">
                Connect. <br /> Collaborate. <br /> <span className="text-primary-400">Create.</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Join thousands of developers, designers, and innovators building the future together. 
                Experience AI-powered matchmaking and seamless collaboration.
            </p>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 transform hover:scale-105 transition-transform duration-300">
                <div className="flex gap-1 mb-3 text-yellow-400">
                    {[1,2,3,4,5].map(i => <Zap key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="italic text-gray-200 mb-4">"CollabX helped me find my co-founders at a hackathon. Now we're YC backed!"</p>
                <div className="flex items-center gap-3">
                    <img src="https://randomuser.me/api/portraits/women/44.jpg" className="w-10 h-10 rounded-full border-2 border-primary-500" alt="User" />
                    <div>
                        <p className="font-bold text-sm">Alex Chen</p>
                        <p className="text-xs text-gray-400">Software Engineer</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white dark:bg-gray-800 relative">
        
        {/* Back to Home Button */}
        <Link to="/" className="absolute top-6 left-6 flex items-center text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors">
            <ArrowLeft size={18} className="mr-1" />
            Back to Home
        </Link>

        <div className="w-full max-w-md space-y-8 animate-fade-in relative mt-8 lg:mt-0">
          
          {/* Login Person Visual */}
          <div className="flex justify-center mb-6">
             <div className="relative group cursor-pointer">
                 <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                 <div className="relative w-28 h-28 bg-white dark:bg-gray-700 rounded-full p-1 ring-4 ring-white dark:ring-gray-800 shadow-xl overflow-hidden">
                    <img 
                        src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${email || 'Felix'}&backgroundColor=c0aede`} 
                        alt="User Avatar" 
                        className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                    />
                 </div>
                 {view === 'login' && (
                     <div className="absolute bottom-1 right-1 w-7 h-7 bg-green-500 border-4 border-white dark:border-gray-800 rounded-full flex items-center justify-center">
                         <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                     </div>
                 )}
             </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                {view === 'forgot' ? 'Reset Password' : view === 'signup' ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
                {view === 'forgot' ? 'Enter your email to receive instructions.' : view === 'signup' ? 'Get started with your free account today.' : 'Please enter your details to sign in.'}
            </p>
          </div>

          {message && (
            <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-xl flex items-center text-sm animate-fade-in">
              <CheckCircle size={16} className="mr-2" />
              {message}
            </div>
          )}

          {view === 'signup' && !selectedRole ? (
            <div className="space-y-4 animate-fade-in">
               {roles.map((role) => (
                   <button 
                    key={role.id}
                    onClick={() => setSelectedRole(role.id as Role)} 
                    className="w-full group flex items-start p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-500 hover:ring-1 hover:ring-primary-500 transition-all text-left bg-white dark:bg-gray-800 shadow-sm hover:shadow-md"
                   >
                     <div className={`p-3 rounded-lg mr-4 ${role.bg} ${role.color} group-hover:scale-110 transition-transform`}>
                         <role.icon size={24} />
                     </div>
                     <div>
                         <h3 className="font-bold text-gray-900 dark:text-white">{role.label}</h3>
                         <p className="text-sm text-gray-500 mt-1">{role.desc}</p>
                     </div>
                     <div className="ml-auto self-center opacity-0 group-hover:opacity-100 transition-opacity text-primary-600">
                         <ArrowRight size={20} />
                     </div>
                   </button>
               ))}
               <div className="text-center pt-4">
                 <button onClick={() => navigate('/login')} className="text-sm text-gray-500 hover:text-primary-600 font-medium">
                    Already have an account? <span className="font-bold text-primary-600">Log in</span>
                 </button>
               </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
              {view === 'signup' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <User size={18} />
                        </div>
                        <input 
                            type="text" 
                            required 
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all shadow-sm"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Mail size={18} />
                    </div>
                    <input 
                        type="email" 
                        required 
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all shadow-sm"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
              </div>

              {view !== 'forgot' && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                     {view === 'login' && (
                        <button type="button" onClick={() => setView('forgot')} className="text-xs font-semibold text-primary-600 hover:text-primary-700">Forgot?</button>
                     )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Lock size={18} />
                    </div>
                    <input 
                        type="password" 
                        required 
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all shadow-sm"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center"
              >
                {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                    <>
                        {view === 'login' ? 'Sign In' : view === 'signup' ? 'Create Account' : 'Send Reset Link'}
                        {view !== 'forgot' && <ArrowRight size={18} className="ml-2" />}
                    </>
                )}
              </button>

              <div className="text-center space-y-4 pt-2">
                {view === 'login' && (
                     <p className="text-sm text-gray-500">
                        Don't have an account? <button type="button" onClick={() => navigate('/signup')} className="text-primary-600 font-bold hover:underline transition-colors">Sign Up</button>
                     </p>
                )}
                {view === 'signup' && (
                   <button type="button" onClick={() => { navigate('/login'); setSelectedRole(null); }} className="flex items-center justify-center w-full text-sm text-gray-500 hover:text-primary-600 font-medium transition-colors">
                      <ArrowLeft size={16} className="mr-1" /> Back to Login
                   </button>
                )}
                {view === 'forgot' && (
                   <button type="button" onClick={() => setView('login')} className="flex items-center justify-center w-full text-sm text-gray-500 hover:text-primary-600 font-medium transition-colors">
                      <ArrowLeft size={16} className="mr-1" /> Back to Login
                   </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};