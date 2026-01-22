import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav style={{ padding: '20px 0', borderBottom: '1px solid #eee', marginBottom: '40px' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/" className="logo-link" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <div style={{ width: '35px', height: '35px', background: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #D4AF37' }}>
                        <span style={{ color: '#D4AF37', fontWeight: 'bold', fontFamily: 'serif' }}>G</span>
                    </div>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'Playfair Display', letterSpacing: '1px' }}>GAST <span style={{ color: '#D4AF37' }}>CINEMA</span></span>
                </Link>
                <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                    {user ? (
                        <>
                            {user.role !== 'admin' && <Link to="/dashboard" className="nav-link">My Tickets</Link>}
                            {user.role === 'admin' && <Link to="/admin" className="nav-link">Admin Portal</Link>}
                            <button onClick={handleLogout} className="btn">Logout</button>
                            <Link to="/profile" title="My Profile" className="nav-link" style={{ display: 'flex' }}>
                                <FaUserCircle size={26} />
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link" style={{ fontWeight: 'bold' }}>Login</Link>
                            <Link to="/register" className="btn btn-accent">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
