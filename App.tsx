
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { User, UserRole } from './types';
import { db } from './services/mockDb';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import StudentHome from './pages/StudentHome';
import ApprovalDashboard from './pages/ApprovalDashboard';
import ClassroomManager from './pages/ClassroomManager';
import Navbar from './components/Navbar';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUserUid = localStorage.getItem('edupass_session');
    if (savedUserUid) {
      const found = db.getUser(savedUserUid);
      if (found) setUser(found);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const allUsers = (db as any).data.users;
    const found = allUsers.find((u: User) => u.email === email);
    
    if (found) {
      // In a real app we'd hash this, but for this mock we check plaintext
      if (found.password === password) {
        setUser(found);
        localStorage.setItem('edupass_session', found.uid);
      } else {
        throw new Error('Invalid password');
      }
    } else {
      throw new Error('User not found');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('edupass_session');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: UserRole[] }> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/signup" element={user ? <Navigate to="/" /> : <SignupPage />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          {user?.role === UserRole.STUDENT ? <StudentHome /> : <ApprovalDashboard />}
        </ProtectedRoute>
      } />

      <Route path="/classroom" element={
        <ProtectedRoute allowedRoles={[UserRole.ADVISOR, UserRole.HOD]}>
          <ClassroomManager />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <AppRoutes />
          </main>
        </div>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
