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
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>GAST CINEMA</Link>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    {user ? (
                        <>
                            {user.role !== 'admin' && <Link to="/dashboard">My Tickets</Link>}
                            {user.role === 'admin' && <Link to="/admin">Admin Portal</Link>}
                            <button onClick={handleLogout} className="btn">Logout</button>
                            <FaUserCircle size={24} />
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn">Login</Link>
                            <Link to="/register" className="btn btn-accent">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
