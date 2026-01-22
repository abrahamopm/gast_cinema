import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    useEffect(() => {
        document.title = "Gast Cinema - Sign Up";
    }, []);

    const getStrength = (pass) => {
        let strength = 0;
        if (pass.length > 5) strength += 1;
        if (pass.length > 10) strength += 1;
        if (/[A-Z]/.test(pass)) strength += 1;
        if (/[0-9]/.test(pass)) strength += 1;
        return strength;
    }

    const strength = getStrength(password);
    const strengthColor = ['#ddd', '#d9534f', '#f0ad4e', '#5bc0de', '#5cb85c'][strength];
    const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][strength];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return showNotification('Passwords do not match', 'error');
        }
        try {
            await api.post('/auth/register', { name, email, password });
            showNotification('Registration Successful! Please login.', 'success');
            navigate('/login');
        } catch (err) {
            showNotification('Registration Failed: ' + (err.response?.data?.error || err.message), 'error');
        }
    };

    return (
        <div style={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to bottom, #fff, #f9f9f9)'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                padding: '40px',
                background: '#fff',
                boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                textAlign: 'center'
            }}>
                <h2 style={{ marginBottom: '30px', fontSize: '2rem' }}>Join the Club</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        style={{ width: '100%', padding: '15px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem', outline: 'none' }}
                    />
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '15px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem', outline: 'none' }}
                    />

                    <div style={{ textAlign: 'left' }}>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '15px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem', outline: 'none' }}
                        />
                        {password && (
                            <div style={{ marginTop: '5px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ flex: 1, height: '4px', background: '#eee', borderRadius: '2px' }}>
                                    <div style={{ width: `${strength * 25}%`, height: '100%', background: strengthColor, transition: 'all 0.3s' }}></div>
                                </div>
                                <span style={{ color: strengthColor, fontWeight: 'bold' }}>{strengthText}</span>
                            </div>
                        )}
                    </div>

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '15px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem', outline: 'none' }}
                    />

                    <button type="submit" className="btn btn-accent" style={{ padding: '15px', fontSize: '1rem' }}>
                        Create Account
                    </button>
                </form>

                <p style={{ marginTop: '20px', color: '#666' }}>
                    Already a memeber? <Link to="/login" style={{ color: '#D4AF37', fontWeight: 'bold' }}>Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
