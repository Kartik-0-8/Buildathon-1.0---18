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
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

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

  if (!user && !location.pathname.includes('login') && !location.pathname.includes('signup')) {
    return <>{children}</>;
  }

  const links = getLinks();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-500 tracking-tighter">CollabX</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link 
                key={link.path} 
                to={link.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              >
                <Icon size={20} className="mr-3" />
                <span className="font-medium">{link.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
             <div className="flex items-center">
                <img src={user?.photoURL} alt="User" className="w-8 h-8 rounded-full mr-2" />
                <div className="overflow-hidden">
                    <p className="text-sm font-semibold truncate w-24">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
             </div>
          </div>
          <button 
            onClick={toggleTheme}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mb-2"
          >
            {isDark ? <Sun size={18} className="mr-3"/> : <Moon size={18} className="mr-3"/>}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button 
            onClick={logout}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg"
          >
            <LogOut size={18} className="mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary-600">CollabX</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white dark:bg-gray-900 pt-16 px-4">
           <nav className="space-y-4">
            {links.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <link.icon size={20} className="mr-3" />
                {link.name}
              </Link>
            ))}
             <button 
                onClick={logout}
                className="flex items-center w-full px-4 py-3 text-red-600 bg-red-50 rounded-lg mt-4"
              >
                <LogOut size={18} className="mr-3" />
                Sign Out
              </button>
           </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:overflow-y-auto pt-16 md:pt-0">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};