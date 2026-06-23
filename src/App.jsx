import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ModeProvider } from './contexts/ModeContext';
import { ToastProvider } from './contexts/ToastContext';
import { LanguageProvider } from './contexts/LanguageContext';

// Pages
import LandingPage from './pages/Landing';
import LoginPage from './pages/Login';
import PersonaSelectPage from './pages/PersonaSelect';
import AmmaDashboard from './pages/dashboards/AmmaDashboard';
import StudentDashboard from './pages/dashboards/StudentDashboard';
import SeniorDashboard from './pages/dashboards/SeniorDashboard';
import BusinessDashboard from './pages/dashboards/BusinessDashboard';
import ScamShieldPage from './pages/ScamShield';

import ProtectedRoute from './components/shared/ProtectedRoute';
import ErrorBoundary from './components/shared/ErrorBoundary';
import Toast from './components/shared/Toast';

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ModeProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </ModeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'linear-gradient(135deg, #FFF8F0 0%, #FFF0F5 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 9999,
    }}>
      <div style={{ fontSize: 64, marginBottom: 16, animation: 'pulse 1.5s ease-in-out infinite' }}>🙏</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: '#800020', marginBottom: 8 }}>Saarthi AI</div>
      <div style={{ fontSize: 14, color: '#9CA3AF', marginBottom: 28 }}>Loading your companion...</div>
      <div style={spinnerStyles.track}>
        <div style={spinnerStyles.bar} />
      </div>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(0.95)} }
        @keyframes slide { 0%{transform:translateX(-100%)} 100%{transform:translateX(300%)} }
      `}</style>
    </div>
  );
}

const spinnerStyles = {
  track: {
    width: 180, height: 4, background: 'rgba(128,0,32,0.1)',
    borderRadius: 4, overflow: 'hidden',
  },
  bar: {
    height: '100%', width: '60%',
    background: 'linear-gradient(90deg, #800020, #D4547A)',
    borderRadius: 4,
    animation: 'slide 1.2s ease-in-out infinite',
  },
};

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/"        element={<LandingPage />} />
        <Route path="/login"   element={<LoginPage />} />

        {/* Protected */}
        <Route path="/choose"  element={<ProtectedRoute><PersonaSelectPage /></ProtectedRoute>} />

        {/* Persona Dashboards — wrapped in ErrorBoundary */}
        <Route path="/amma/*"     element={
          <ProtectedRoute>
            <ErrorBoundary>
              <AmmaDashboard />
            </ErrorBoundary>
          </ProtectedRoute>
        } />
        <Route path="/student/*"  element={
          <ProtectedRoute>
            <ErrorBoundary>
              <StudentDashboard />
            </ErrorBoundary>
          </ProtectedRoute>
        } />
        <Route path="/senior/*"   element={
          <ProtectedRoute>
            <ErrorBoundary>
              <SeniorDashboard />
            </ErrorBoundary>
          </ProtectedRoute>
        } />
        <Route path="/business/*" element={
          <ProtectedRoute>
            <ErrorBoundary>
              <BusinessDashboard />
            </ErrorBoundary>
          </ProtectedRoute>
        } />

        {/* Scam Shield — accessible from all personas */}
        <Route path="/scam-shield" element={
          <ProtectedRoute>
            <ErrorBoundary>
              <ScamShieldPage />
            </ErrorBoundary>
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toast />
    </>
  );
}
