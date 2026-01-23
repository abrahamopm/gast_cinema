import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    useEffect(() => {
        document.title = "Gast Cinema - Login";
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Attempting login with:", email);
        try {
            const res = await api.post('/auth/login', { email, password });
            console.log("Login success:", res.data);
            login(res.data);
            showNotification('Welcome back!', 'success');
            navigate('/');
        } catch (err) {
            console.error("Login error:", err);
            showNotification('Login Failed: ' + (err.response?.data?.error || err.message), 'error');
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
                <h2 style={{ marginBottom: '30px', fontSize: '2rem' }}>Welcome Back</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '15px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.3s'
                            }}
                            onFocus={e => e.target.style.borderColor = '#D4AF37'}
                            onBlur={e => e.target.style.borderColor = '#ddd'}
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '15px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.3s'
                            }}
                            onFocus={e => e.target.style.borderColor = '#D4AF37'}
                            onBlur={e => e.target.style.borderColor = '#ddd'}
                        />
                    </div>

                    <button type="submit" className="btn btn-accent" style={{ padding: '15px', fontSize: '1rem' }}>
                        Sign In
                    </button>
                </form>

                <p style={{ marginTop: '20px', color: '#666' }}>
                    New to Gast Cinema? <Link to="/register" style={{ color: '#D4AF37', fontWeight: 'bold' }}>Create Account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
