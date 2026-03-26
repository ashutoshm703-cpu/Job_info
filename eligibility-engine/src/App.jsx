import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { ShieldCheck, UserCog, GraduationCap } from 'lucide-react';
import AdminDashboard from './pages/Admin';
import StudentPortal from './pages/Student';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="nav-header">
          <NavLink to="/" className="nav-brand">
            <ShieldCheck size={28} color="var(--accent-primary)" />
            <span>Eligibility Core</span>
          </NavLink>
          <nav className="nav-links">
            <NavLink 
              to="/admin" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserCog size={18} />
                Admin Matrix
              </div>
            </NavLink>
            <NavLink 
              to="/student" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <GraduationCap size={18} />
                Student Portal
              </div>
            </NavLink>
          </nav>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/student" replace />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/student" element={<StudentPortal />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
