
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Briefcase, Calendar, Lock, Mail, ArrowLeft, ArrowRight, CheckCircle, Building, AlertCircle, KeyRound } from 'lucide-react';
import { ThemeSwitcher } from '../theme/ThemeSwitcher';

export const AuthScreen: React.FC = () => {
  const { login, signup, resetPassword, confirmPasswordReset, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [view, setView] = useState<'login' | 'signup' | 'forgot'>(() => 
    location.pathname.includes('signup') ? 'signup' : 'login'
  );
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Forgot Password State
  const [resetStep, setResetStep] = useState<'email' | 'otp'>('email');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Role Selection
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [signupStep, setSignupStep] = useState<'basic' | 'profile'>('basic');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Student Fields
  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');
  const [bio, setBio] = useState('');

  // Organizer Fields
  const [orgName, setOrgName] = useState('');
  const [locationStr, setLocationStr] = useState('');
  const [website, setWebsite] = useState('');
  const [themes, setThemes] = useState('');

  // Professional Fields
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [yoe, setYoe] = useState<number>(0);
  const [profSkills, setProfSkills] = useState('');
  const [domainExpertise, setDomainExpertise] = useState('');
  const [hiringType, setHiringType] = useState('Intern');

  useEffect(() => {
    if (location.pathname.includes('signup')) {
        setView('signup');
    } else if (location.pathname.includes('login')) {
        if (view === 'signup') {
            setView('login');
            setSelectedRole(null);
            setSignupStep('basic');
        }
    }
  }, [location.pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    try {
        if (view === 'forgot') {
            if (resetStep === 'email') {
                await resetPassword(email);
                setMessage('OTP sent to your email (check console).');
                setResetStep('otp');
            } else {
                await confirmPasswordReset(email, otp, newPassword);
                setMessage('Password reset successful. Please log in.');
                setTimeout(() => {
                    setView('login');
                    setResetStep('email');
                    setOtp('');
                    setNewPassword('');
                    setPassword('');
                }, 2000);
            }
            return;
        }

        if (view === 'login') {
            await login(email, password);
        } else {
            // Signup Logic
            if (!selectedRole) return;
            
            if (signupStep === 'basic') {
                setSignupStep('profile');
                return;
            }
            
            let profileData: any = { name, bio };

            if (selectedRole === 'student') {
                profileData = {
                    ...profileData,
                    skills: skills.split(',').map(s => s.trim()).filter(s => s),
                    interests: interests.split(',').map(s => s.trim()).filter(s => s),
                };
            } else if (selectedRole === 'organizer') {
                profileData = {
                    name,
                    organizationName: orgName,
                    location: locationStr,
                    website,
                    themes: themes.split(',').map(s => s.trim()).filter(s => s),
                    bio 
                };
            } else if (selectedRole === 'professional') {
                profileData = {
                    ...profileData,
                    company,
                    position,
                    yearsOfExperience: yoe,
                    skills: profSkills.split(',').map(s => s.trim()).filter(s => s),
                    domainExpertise: domainExpertise.split(',').map(s => s.trim()).filter(s => s),
                    hiringRequirements: {
                        requiredSkills: [],
                        domain: '',
                        experienceNeeded: 0,
                        duration: '',
                        stipend: '',
                        location: '',
                        projectDescription: '',
                        hiringType: hiringType
                    }
                };
            }

            await signup(email, password, selectedRole, profileData);
        }
    } catch (err: any) {
        setError(err.message || "An error occurred.");
    }
  };

  const handleSignupBack = () => {
      if (signupStep === 'profile') {
          setSignupStep('basic');
      } else {
          setSelectedRole(null);
      }
  };

  const roles = [
    { 
        id: 'student', 
        icon: User, 
        label: 'Student', 
        desc: 'Join hackathons, find teams, and earn badges.',
        color: 'text-blue-600 dark:text-blue-500', 
        bg: 'bg-blue-50 dark:bg-blue-900/20' 
    },
    { 
        id: 'organizer', 
        icon: Calendar, 
        label: 'Organizer', 
        desc: 'Post hackathons, manage participants.',
        color: 'text-purple-600 dark:text-purple-500', 
        bg: 'bg-purple-50 dark:bg-purple-900/20' 
    },
    { 
        id: 'professional', 
        icon: Briefcase, 
        label: 'Professional', 
        desc: 'Hire talent, find interns, and mentor.',
        color: 'text-green-600 dark:text-green-500', 
        bg: 'bg-green-50 dark:bg-green-900/20' 
    }
  ];

  // Common input class string for consistency
  const inputClasses = "w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all";
  const simpleInputClasses = "w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all";

  return (
    <div className="min-h-screen flex font-sans bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Left Panel - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 overflow-hidden text-white items-center justify-center p-12">
        <div className="absolute inset-0 z-0">
             <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
             <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/30 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
             <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Collaboration" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" />
        </div>

        <div className="relative z-10 max-w-lg">
            <h1 className="text-5xl font-extrabold mb-6 leading-tight">
                Connect. <br /> Collaborate. <br /> <span className="text-primary-400">Create.</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                The ultimate ecosystem for students, professionals, and organizers.
            </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white dark:bg-gray-900 relative transition-colors duration-300">
        <Link to="/" className="absolute top-6 left-6 flex items-center text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors z-20">
            <ArrowLeft size={18} className="mr-1" /> Back to Home
        </Link>

        {/* Theme Switcher - Absolute Positioned Top Right */}
        <div className="absolute top-6 right-6 z-20 w-40">
            <ThemeSwitcher />
        </div>

        <div className="w-full max-w-md space-y-8 animate-fade-in mt-12 lg:mt-0">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                {view === 'forgot' ? 'Reset Password' : view === 'signup' ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
                {view === 'signup' && signupStep === 'profile' ? `Complete your ${selectedRole} profile.` : view === 'forgot' && resetStep === 'otp' ? 'Enter OTP and new password.' : 'Please enter your details.'}
            </p>
          </div>

          {message && (
            <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center text-sm">
              <CheckCircle size={16} className="mr-2" /> {message}
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center text-sm">
              <AlertCircle size={16} className="mr-2" /> {error}
            </div>
          )}

          {view === 'signup' && !selectedRole ? (
            <div className="space-y-4 animate-fade-in">
               {roles.map((role) => (
                   <button 
                    key={role.id}
                    onClick={() => setSelectedRole(role.id as Role)} 
                    className="w-full group flex items-start p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-left bg-white dark:bg-gray-800 shadow-sm"
                   >
                     <div className={`p-3 rounded-lg mr-4 ${role.bg} ${role.color} group-hover:scale-110 transition-transform`}>
                         <role.icon size={24} />
                     </div>
                     <div>
                         <h3 className="font-bold text-gray-900 dark:text-white">{role.label}</h3>
                         <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{role.desc}</p>
                     </div>
                   </button>
               ))}
               <div className="text-center pt-4">
                 <button onClick={() => navigate('/login')} className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 font-medium">
                    Already have an account? <span className="font-bold text-primary-600">Log in</span>
                 </button>
               </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
              {view === 'signup' && signupStep === 'profile' ? (
                  <div className="space-y-4">
                      {/* --- Student Specific Fields --- */}
                      {selectedRole === 'student' && (
                          <>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Top Skills</label>
                                <input type="text" className={simpleInputClasses} placeholder="React, Node.js..." value={skills} onChange={(e) => setSkills(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Interests</label>
                                <input type="text" className={simpleInputClasses} placeholder="AI, Fintech..." value={interests} onChange={(e) => setInterests(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Bio</label>
                                <textarea className={simpleInputClasses} rows={3} placeholder="Tell us about yourself..." value={bio} onChange={(e) => setBio(e.target.value)} />
                            </div>
                          </>
                      )}

                      {/* --- Organizer Specific Fields --- */}
                      {selectedRole === 'organizer' && (
                          <>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Organization Name</label>
                                <input type="text" required className={simpleInputClasses} placeholder="Tech Corp Inc." value={orgName} onChange={(e) => setOrgName(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Location</label>
                                <input type="text" required className={simpleInputClasses} placeholder="New York, NY" value={locationStr} onChange={(e) => setLocationStr(e.target.value)} />
                            </div>
                             <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Website</label>
                                <input type="text" className={simpleInputClasses} placeholder="https://..." value={website} onChange={(e) => setWebsite(e.target.value)} />
                            </div>
                          </>
                      )}

                      {/* --- Professional Specific Fields --- */}
                      {selectedRole === 'professional' && (
                          <>
                             <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Company / Organization</label>
                                <div className="relative">
                                    <Building size={18} className="absolute top-3.5 left-3 text-gray-400"/>
                                    <input type="text" required className={inputClasses} placeholder="Google, Startup Inc..." value={company} onChange={(e) => setCompany(e.target.value)} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Position</label>
                                    <input type="text" required className={simpleInputClasses} placeholder="Sr. Engineer" value={position} onChange={(e) => setPosition(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Exp (Years)</label>
                                    <input type="number" required className={simpleInputClasses} placeholder="5" value={yoe} onChange={(e) => setYoe(Number(e.target.value))} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Your Skills (Multi-select)</label>
                                <input type="text" className={simpleInputClasses} placeholder="Java, System Design, AWS..." value={profSkills} onChange={(e) => setProfSkills(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Domain Expertise</label>
                                <input type="text" className={simpleInputClasses} placeholder="Fintech, AI, Healthcare..." value={domainExpertise} onChange={(e) => setDomainExpertise(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Hiring Preference</label>
                                <select className={simpleInputClasses} value={hiringType} onChange={e => setHiringType(e.target.value)}>
                                    <option value="Intern">Internship</option>
                                    <option value="Project">Project Based</option>
                                    <option value="Fulltime">Full Time</option>
                                    <option value="Freelance">Freelance</option>
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Bio</label>
                                <textarea className={simpleInputClasses} rows={2} placeholder="Brief professional bio..." value={bio} onChange={(e) => setBio(e.target.value)} />
                            </div>
                          </>
                      )}
                  </div>
              ) : (
                  // Step 1: Basic Info (Login, Signup Basic, Forgot Password)
                  <div className="space-y-4">
                    
                    {/* Forgot Password OTP View */}
                    {view === 'forgot' && resetStep === 'otp' ? (
                        <>
                             <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">OTP Code</label>
                                <div className="relative">
                                    <KeyRound size={18} className="absolute top-3.5 left-3 text-gray-400"/>
                                    <input type="text" required className={inputClasses} placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value)} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">New Password</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute top-3.5 left-3 text-gray-400"/>
                                    <input type="password" required className={inputClasses} placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Standard Fields */}
                            {view === 'signup' && (
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Full Name</label>
                                    <div className="relative">
                                        <User size={18} className="absolute top-3.5 left-3 text-gray-400"/>
                                        <input type="text" required className={inputClasses} placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email Address</label>
                                <div className="relative">
                                    <Mail size={18} className="absolute top-3.5 left-3 text-gray-400"/>
                                    <input type="email" required className={inputClasses} placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={view === 'forgot' && resetStep === 'otp'} />
                                </div>
                            </div>

                            {view !== 'forgot' && (
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                        {view === 'login' && <button type="button" onClick={() => { setView('forgot'); setError(''); setMessage(''); }} className="text-xs text-primary-600 hover:underline">Forgot?</button>}
                                    </div>
                                    <div className="relative">
                                        <Lock size={18} className="absolute top-3.5 left-3 text-gray-400"/>
                                        <input type="password" required className={inputClasses} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                  </div>
              )}
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 
                 (view === 'login' ? 'Sign In' : 
                  view === 'signup' && signupStep === 'basic' ? 'Next: Profile' : 
                  view === 'signup' ? 'Create Account' : 
                  view === 'forgot' && resetStep === 'otp' ? 'Reset Password' : 'Send Reset Link')}
                {view !== 'forgot' && <ArrowRight size={18} className="ml-2" />}
              </button>

              <div className="text-center pt-2">
                {view === 'login' && (
                     <p className="text-sm text-gray-500 dark:text-gray-400">Don't have an account? <button type="button" onClick={() => { setView('signup'); setError(''); setMessage(''); }} className="text-primary-600 font-bold hover:underline">Sign Up</button></p>
                )}
                {view === 'signup' && (
                   <button type="button" onClick={handleSignupBack} className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 font-medium">
                      <ArrowLeft size={16} className="inline mr-1" /> {signupStep === 'profile' ? 'Back' : 'Back to Login'}
                   </button>
                )}
                {view === 'forgot' && (
                   <button type="button" onClick={() => { setView('login'); setResetStep('email'); setError(''); setMessage(''); }} className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 font-medium">Back to Login</button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
