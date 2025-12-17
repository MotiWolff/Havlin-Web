import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import About from './pages/About';
import Family from './pages/Family';
import Gallery from './pages/Gallery';
import Calendar from './pages/Calendar';
import Trivia from './pages/Trivia';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Backwards-compatible legacy HTML routes */}
        <Route path="/index.html" element={<Navigate to="/" replace />} />
        <Route path="/home.html" element={<Navigate to="/home" replace />} />
        <Route path="/about.html" element={<Navigate to="/about" replace />} />
        <Route path="/family.html" element={<Navigate to="/family" replace />} />
        <Route path="/gallery.html" element={<Navigate to="/gallery" replace />} />
        <Route path="/calendar.html" element={<Navigate to="/calendar" replace />} />
        <Route path="/trivia.html" element={<Navigate to="/trivia" replace />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
         <Route path="/gallery" element={
          <ProtectedRoute>
            <Gallery />
          </ProtectedRoute>
        } />
         <Route path="/calendar" element={
          <ProtectedRoute>
            <Calendar />
          </ProtectedRoute>
        } />
         <Route path="/about" element={
          <ProtectedRoute>
            <About />
          </ProtectedRoute>
        } />
         <Route path="/family" element={
          <ProtectedRoute>
            <Family />
          </ProtectedRoute>
        } />
         <Route path="/trivia" element={
          <ProtectedRoute>
            <Trivia />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
