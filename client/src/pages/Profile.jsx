import React, { useState } from 'react';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user } = useAuth();
    const { showNotification } = useNotification();
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

    const handleChange = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            return showNotification('New passwords do not match', 'error');
        }

        try {
            await api.post('/auth/password', {
                currentPassword: passwords.current,
                newPassword: passwords.new
            });
            showNotification('Password changed successfully!', 'success');
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (err) {
            showNotification(err.response?.data?.error || 'Failed to update password', 'error');
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '60px auto', padding: '0 20px' }}>
            <h2 style={{ marginBottom: '40px', textAlign: 'center' }}>My Profile</h2>

            <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', marginBottom: '40px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>User Details</h3>
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Role:</strong> {user?.role}</p>
            </div>

            <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Change Password</h3>
                <form onSubmit={handleChange} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <input
                        type="password"
                        placeholder="Current Password"
                        value={passwords.current}
                        onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                        required
                        style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                    <input
                        type="password"
                        placeholder="New Password"
                        value={passwords.new}
                        onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                        required
                        style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={passwords.confirm}
                        onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                        required
                        style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                    <button type="submit" className="btn btn-accent">Update Password</button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
