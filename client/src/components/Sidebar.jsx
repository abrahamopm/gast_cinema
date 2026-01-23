import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaTimes, FaTicketAlt, FaHome, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

const Sidebar = ({ isOpen, onClose, user, onLogout }) => {
    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.5)',
                    zIndex: 1500,
                    opacity: isOpen ? 1 : 0,
                    visibility: isOpen ? 'visible' : 'hidden',
                    transition: 'all 0.3s ease'
                }}
            />

            {/* Sidebar Panel */}
            <div style={{
                position: 'fixed',
                top: 0,
                right: 0,
                width: '300px',
                height: '100%',
                background: '#fff',
                zIndex: 2000,
                transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '-5px 0 25px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column'
            }}>

                {/* Header */}
                <div style={{ padding: '30px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem', fontFamily: 'Playfair Display' }}>GAST <span style={{ color: '#D4AF37' }}>MENU</span></span>
                    <button onClick={onClose} style={{ fontSize: '1.5rem', color: '#000' }}><FaTimes /></button>
                </div>

                {/* Links */}
                <div style={{ padding: '30px', flex: 1 }}>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '20px' }}>
                            <Link to="/" onClick={onClose} className="sidebar-link">
                                <FaHome style={{ marginRight: '15px', color: '#D4AF37' }} /> Home
                            </Link>
                        </li>
                        {user ? (
                            <>
                                <li style={{ marginBottom: '20px' }}>
                                    <Link to="/profile" onClick={onClose} className="sidebar-link">
                                        <FaUserCircle style={{ marginRight: '15px', color: '#D4AF37' }} /> My Profile
                                    </Link>
                                </li>
                                <li style={{ marginBottom: '20px' }}>
                                    {user.role === 'admin' ? (
                                        <Link to="/admin" onClick={onClose} className="sidebar-link">
                                            <FaTicketAlt style={{ marginRight: '15px', color: '#D4AF37' }} /> Admin Portal
                                        </Link>
                                    ) : (
                                        <Link to="/dashboard" onClick={onClose} className="sidebar-link">
                                            <FaTicketAlt style={{ marginRight: '15px', color: '#D4AF37' }} /> My Tickets
                                        </Link>
                                    )}
                                </li>
                                <li style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                                    <button onClick={() => { onLogout(); onClose(); }} className="sidebar-link" style={{ width: '100%', textAlign: 'left' }}>
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li style={{ marginBottom: '20px' }}>
                                    <Link to="/login" onClick={onClose} className="sidebar-link">
                                        <FaSignInAlt style={{ marginRight: '15px', color: '#D4AF37' }} /> Login
                                    </Link>
                                </li>
                                <li style={{ marginBottom: '20px' }}>
                                    <Link to="/register" onClick={onClose} className="sidebar-link">
                                        <FaUserPlus style={{ marginRight: '15px', color: '#D4AF37' }} /> Sign Up
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>

                {/* Footer */}
                <div style={{ padding: '30px', background: '#f9f9f9', fontSize: '0.8rem', color: '#888', textAlign: 'center' }}>
                    &copy; 2026 Gast Cinema
                </div>
            </div>

            <style>{`
        .sidebar-link {
          display: flex;
          align-items: center;
          font-size: 1.1rem;
          color: #333;
          padding: 10px;
          border-radius: 8px;
          transition: all 0.2s;
        }
        .sidebar-link:hover {
          background: #fdfdfd;
          color: #D4AF37;
          padding-left: 15px;
        }
      `}</style>
        </>
    );
};

export default Sidebar;
