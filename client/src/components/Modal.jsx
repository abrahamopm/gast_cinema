import React from 'react';

const Modal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(5px)'
        }}>
            <div style={{
                background: '#fff',
                padding: '30px',
                borderRadius: '8px',
                maxWidth: '400px',
                width: '90%',
                boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                animation: 'scaleIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}>
                <h3 style={{ margin: '0 0 15px 0', fontSize: '1.5rem' }}>{title}</h3>
                <p style={{ color: '#666', marginBottom: '25px', lineHeight: '1.5' }}>{message}</p>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                    <button
                        onClick={onClose}
                        className="btn"
                        style={{ fontSize: '0.9rem', padding: '10px 20px' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => { onConfirm(); onClose(); }}
                        className="btn btn-accent"
                        style={{ fontSize: '0.9rem', padding: '10px 20px', border: 'none' }}
                    >
                        Confirm
                    </button>
                </div>
            </div>
            <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
        </div>
    );
};

export default Modal;
