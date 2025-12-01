
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { AuthScreen } from './components/auth/AuthScreen';
import { LandingPage } from './components/LandingPage';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { OrganizerDashboard } from './components/dashboard/OrganizerDashboard';
import { ProfessionalDashboard } from './components/dashboard/ProfessionalDashboard';
import { HackathonList } from './components/dashboard/HackathonList';
import { ChatRoom } from './components/chat/ChatRoom';
import { Role, StudentProfile } from './types';
import { Users, AlertCircle } from 'lucide-react';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRole?: string }> = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    if (user.role === 'student') return <Navigate to="/dashboard" replace />;
    if (user.role === 'organizer') return <Navigate to="/organizer/dashboard" replace />;
    if (user.role === 'professional') return <Navigate to="/professional/dashboard" replace />;
  }

  return <>{children}</>;
};

const RedirectToRole: React.FC = () => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;

    switch(user.role) {
        case 'student': return <Navigate to="/dashboard" replace />;
        case 'organizer': return <Navigate to="/organizer/dashboard" replace />;
        case 'professional': return <Navigate to="/professional/dashboard" replace />;
        default: return <Navigate to="/dashboard" replace />;
    }
}

// Wrapper for Team Chat to handle dynamic Team ID
const StudentTeamView: React.FC = () => {
    const { user } = useAuth();
    const student = user as StudentProfile;
    const teamId = student?.teamId;

    if (!teamId) {
        return (
            <div className="flex flex-col items-center justify-center h-[600px] bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 text-center animate-fade-in">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <Users size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Team Yet</h3>
                <p className="text-gray-500 max-w-md mb-6">You haven't joined a team yet. Go to the dashboard to find teammates or wait for invitations!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px] animate-fade-in">
             <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-gray-500 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-purple-500"></div>
                <Users size={48} className="mb-4 text-primary-200 dark:text-gray-700" />
                <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">Team Management</h3>
                <p className="text-sm text-center px-8">Manage roles, tasks, and project details here.</p>
             </div>
             <ChatRoom roomId={teamId} />
        </div>
    );
};

const AppRoutes = () => {
    const { user } = useAuth();

    return (
        <Layout>
            <Routes>
                {/* Public Route */}
                <Route path="/" element={!user ? <LandingPage /> : <RedirectToRole />} />
                
                <Route path="/login" element={!user ? <AuthScreen /> : <RedirectToRole />} />
                <Route path="/signup" element={!user ? <AuthScreen /> : <RedirectToRole />} />
                
                {/* Student Routes */}
                <Route path="/dashboard" element={
                    <ProtectedRoute allowedRole="student">
                        <StudentDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/hackathons" element={
                    <ProtectedRoute allowedRole="student">
                         <HackathonList />
                    </ProtectedRoute>
                } />
                <Route path="/team" element={
                    <ProtectedRoute allowedRole="student">
                         <StudentTeamView />
                    </ProtectedRoute>
                } />

                {/* Organizer Routes */}
                <Route path="/organizer/dashboard" element={
                    <ProtectedRoute allowedRole="organizer">
                        <OrganizerDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/organizer/chat" element={
                    <ProtectedRoute allowedRole="organizer">
                        <ChatRoom roomId="organizer-general" />
                    </ProtectedRoute>
                } />
                <Route path="/organizer/post" element={
                    <ProtectedRoute allowedRole="organizer">
                         <div className="p-4 text-center text-gray-500">Use the Dashboard to post new events.</div>
                    </ProtectedRoute>
                } />

                {/* Professional Routes */}
                <Route path="/professional/dashboard" element={
                    <ProtectedRoute allowedRole="professional">
                        <ProfessionalDashboard />
                    </ProtectedRoute>
                } />
            </Routes>
        </Layout>
    );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
