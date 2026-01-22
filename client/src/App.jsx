import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MovieDetails from './pages/MovieDetails';
import Booking from './pages/Booking';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import { AuthProvider } from './context/AuthContext';
import './index.css';

import { NotificationProvider } from './context/NotificationContext';

import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="app">
            <Navbar />
            <main className="container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/booking/:id" element={<Booking />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
