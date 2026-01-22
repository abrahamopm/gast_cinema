import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars } from 'react-icons/fa';
import Sidebar from './Sidebar';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                user={user}
                onLogout={handleLogout}
            />

            <nav style={{ padding: '20px 0', borderBottom: '1px solid #eee', marginBottom: '40px' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/" className="logo-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                        <div style={{ width: '35px', height: '35px', background: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D4AF37' }}>
                            <span style={{ color: '#D4AF37', fontWeight: 'bold', fontFamily: 'serif' }}>G</span>
                        </div>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'Playfair Display', letterSpacing: '1px' }}>GAST <span style={{ color: '#D4AF37' }}>CINEMA</span></span>
                    </Link>

                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="btn"
                        style={{ fontSize: '1.5rem', padding: '10px', border: 'none' }}
                        aria-label="Open Menu"
                    >
                        <FaBars />
                    </button>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
