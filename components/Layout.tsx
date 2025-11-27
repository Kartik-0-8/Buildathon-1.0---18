
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  Users, 
  Calendar, 
  MessageSquare, 
  LogOut, 
  Moon, 
  Sun,
  Menu,
  X,
  Briefcase
} from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  // Initialize theme based on local storage or system preference
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('theme');
        if (stored) return stored === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Apply theme class to html element
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Listen for system theme changes if no user preference is stored
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
        if (!localStorage.getItem('theme')) {
            setIsDark(e.matches);
        }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
      const newMode = !isDark;
      setIsDark(newMode);
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  // Define routes where the dashboard sidebar/footer should NOT appear
  const isPublicRoute = 
    location.pathname === '/' || 
    location.pathname.startsWith('/login') || 
    location.pathname.startsWith('/signup') ||
    location.pathname.startsWith('/select-role');

  // If user is not logged in OR is on a public route, render content without dashboard layout
  if (!user || isPublicRoute) {
    return <>{children}</>;
  }

  // --- Authenticated Dashboard Logic ---

  const getLinks = () => {
    if (!user) return [];
    if (user.role === 'student') {
      return [
        { name: 'Dashboard', path: '/dashboard', icon: Home },
        { name: 'Hackathons', path: '/hackathons', icon: Calendar },
        { name: 'Team', path: '/team', icon: Users },
      ];
    } else if (user.role === 'organizer') {
      return [
        { name: 'Dashboard', path: '/organizer/dashboard', icon: Home },
        { name: 'Post Hackathon', path: '/organizer/post', icon: Calendar },
        { name: 'Community', path: '/organizer/chat', icon: MessageSquare },
      ];
    } else {
      return [
        { name: 'Dashboard', path: '/professional/dashboard', icon: Home },
        { name: 'Mentorship', path: '/professional/mentorship', icon: Users },
        { name: 'Talent', path: '/professional/talent', icon: Briefcase },
      ];
    }
  };

  const links = getLinks();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm z-30">
        <div className="p-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
            <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-500 tracking-tighter">CollabX</h1>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link 
                key={link.path} 
                to={link.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <Icon size={20} className="mr-3" />
                <span>{link.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer - Only visible when authenticated */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center overflow-hidden">
                <img src={user?.photoURL} alt="User" className="w-9 h-9 rounded-full mr-3 border border-gray-200 dark:border-gray-600" />
                <div className="min-w-0">
                    <p className="text-sm font-bold truncate text-gray-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize truncate">{user?.role}</p>
                </div>
             </div>
          </div>
          <button 
            onClick={toggleTheme}
            className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mb-2 transition-colors"
          >
            {isDark ? <Sun size={18} className="mr-3 text-yellow-500"/> : <Moon size={18} className="mr-3 text-primary-600"/>}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button 
            onClick={logout}
            className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut size={18} className="mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">C</div>
           <h1 className="text-xl font-bold text-primary-600 dark:text-white">CollabX</h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600 dark:text-gray-300">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white dark:bg-gray-900 pt-20 px-4 pb-6 overflow-y-auto">
           <nav className="space-y-2">
            {links.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium border border-transparent active:border-primary-500"
              >
                <link.icon size={20} className="mr-3 text-primary-600" />
                {link.name}
              </Link>
            ))}
             
             <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-6">
                    <img src={user?.photoURL} alt="User" className="w-10 h-10 rounded-full mr-3" />
                    <div>
                        <p className="font-bold">{user?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                </div>
                
                <button 
                  onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }}
                  className="flex items-center w-full px-4 py-3 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg mb-3"
                >
                  {isDark ? <Sun size={20} className="mr-3"/> : <Moon size={20} className="mr-3"/>}
                  {isDark ? 'Switch to Light' : 'Switch to Dark'}
                </button>

                <button 
                    onClick={logout}
                    className="flex items-center w-full px-4 py-3 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg"
                  >
                    <LogOut size={20} className="mr-3" />
                    Sign Out
                </button>
             </div>
           </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:overflow-y-auto pt-16 md:pt-0 bg-gray-50 dark:bg-gray-900 relative">
        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
};
