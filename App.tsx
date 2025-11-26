
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
import { Role } from './types';

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
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px]">
                             <div className="p-4 bg-white dark:bg-gray-800 rounded shadow flex items-center justify-center text-gray-500">Team Management UI</div>
                             <ChatRoom roomId="demo-room" />
                         </div>
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
