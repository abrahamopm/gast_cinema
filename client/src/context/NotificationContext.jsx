import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const showNotification = useCallback((message, type = 'info') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            removeNotification(id);
        }, 4000);
    }, []);

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <div style={{
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                alignItems: 'center',
                pointerEvents: 'none' // Allow clicks through container
            }}>
                {notifications.map(n => (
                    <NotificationItem key={n.id} notification={n} onClose={() => removeNotification(n.id)} />
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

const NotificationItem = ({ notification, onClose }) => {
    const [isExiting, setIsExiting] = useState(false);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => Math.max(0, prev - 1)); // Decrement progress
        }, 35); // 4000ms / 100 roughly

        return () => clearInterval(timer);
    }, []);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(onClose, 300); // Wait for exit animation
    };

    let icon, bgColor, borderColor;
    switch (notification.type) {
        case 'success':
            icon = <FaCheckCircle size={20} color="#2ecc71" />; // Emerald Green
            bgColor = 'rgba(20, 20, 20, 0.85)';
            borderColor = '#2ecc71';
            break;
        case 'error':
            icon = <FaExclamationCircle size={20} color="#e74c3c" />; // Alizarin Red
            bgColor = 'rgba(20, 20, 20, 0.85)';
            borderColor = '#e74c3c';
            break;
        default:
            icon = <FaInfoCircle size={20} color="#D4AF37" />; // Gold
            bgColor = 'rgba(20, 20, 20, 0.85)';
            borderColor = '#D4AF37';
    }

    return (
        <div style={{
            pointerEvents: 'auto', // Re-enable clicks
            minWidth: '350px',
            background: bgColor,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: `1px solid rgba(255, 255, 255, 0.1)`,
            borderLeft: `5px solid ${borderColor}`,
            borderRadius: '8px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            color: '#fff',
            fontFamily: "'Inter', sans-serif",
            animation: isExiting ? 'slideOut 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards' : 'slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {icon}
                <span style={{ fontSize: '15px', fontWeight: '500', letterSpacing: '0.3px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                    {notification.message}
                </span>
            </div>

            <button
                onClick={handleClose}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255,255,255,0.6)',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '5px',
                    transition: 'color 0.2s',
                    marginLeft: '15px'
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
            >
                <FaTimes />
            </button>

            {/* Progress Bar */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '3px',
                background: `linear-gradient(90deg, ${borderColor}, transparent)`,
                width: `${progress}%`,
                transition: 'width 0.05s linear'
            }} />

            <style>{`
                @keyframes slideIn {
                    from { transform: translateY(-100%) scale(0.9); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateY(0) scale(1); opacity: 1; }
                    to { transform: translateY(-50px) scale(0.95); opacity: 0; }
                }
            `}</style>
        </div>
    );
};
