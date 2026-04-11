import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/Admin';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">


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
