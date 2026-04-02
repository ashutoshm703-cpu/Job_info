import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { ShieldCheck, UserCog } from 'lucide-react';
import AdminDashboard from './pages/Admin';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="nav-header" style={{ justifyContent: 'center' }}>
          <NavLink to="/" className="nav-brand">
            <ShieldCheck size={28} color="var(--accent-primary)" />
            <span>Eligibility Core</span>
          </NavLink>
          
          <nav className="nav-links">
            <NavLink 
              to="/" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserCog size={18} />
                <span>Admin Matrix</span>
              </div>
            </NavLink>
          </nav>
        </header>

        <Routes>
          {/* Default entry point is now Admin Matrix */}
          <Route path="/" element={<AdminDashboard />} />
          
          {/* Legacy route redirection or fallback */}
          <Route path="/admin" element={<Navigate to="/" replace />} />
          
          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
