import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';

const Admin = () => {
    const [movies, setMovies] = useState([]);
    const [form, setForm] = useState({ title: '', description: '', poster: '', trailer: '', featured: false });
    const [isAdding, setIsAdding] = useState(false);
    const { showNotification } = useNotification();

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = () => api.get('/movies').then(res => setMovies(res.data)).catch(err => showNotification('Failed to load movies', 'error'));

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/movies', form);
            showNotification('Movie Added Successfully', 'success');
            setForm({ title: '', description: '', poster: '', trailer: '', featured: false });
            setIsAdding(false);
            fetchMovies();
        } catch (err) {
            showNotification('Failed to add movie', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this movie from the collection?')) {
            try {
                await api.delete(`/movies/${id}`);
                showNotification('Movie Removed', 'success');
                fetchMovies();
            } catch (err) {
                showNotification('Delete Failed', 'error');
            }
        }
    };

    return (
        <div style={{ paddingTop: '40px', paddingBottom: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
                <div>
                    <h2>Admin Dashboard</h2>
                    <p style={{ color: '#666' }}>Manage your cinema collection and showtimes.</p>
                </div>
                <button className="btn btn-accent" onClick={() => setIsAdding(!isAdding)}>
                    {isAdding ? 'Cancel' : '+ Add Movie'}
                </button>
            </div>

            {isAdding && (
                <div style={{
                    background: '#fff',
                    padding: '40px',
                    borderRadius: '8px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                    marginBottom: '60px',
                    animation: 'slideDown 0.5s ease'
                }}>
                    <h3 style={{ marginBottom: '30px' }}>Add New Feature</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', letterSpacing: '1px', color: '#666' }}>TITLE</label>
                            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required
                                style={{ width: '100%', padding: '15px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none' }}
                            />
                        </div>

                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', letterSpacing: '1px', color: '#666' }}>SYNOPSIS</label>
                            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows="4"
                                style={{ width: '100%', padding: '15px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none', resize: 'vertical' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', letterSpacing: '1px', color: '#666' }}>POSTER URL</label>
                            <input value={form.poster} onChange={e => setForm({ ...form, poster: e.target.value })}
                                style={{ width: '100%', padding: '15px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', letterSpacing: '1px', color: '#666' }}>TRAILER URL</label>
                            <input value={form.trailer} onChange={e => setForm({ ...form, trailer: e.target.value })}
                                style={{ width: '100%', padding: '15px', border: '1px solid #ddd', fontSize: '1rem', outline: 'none' }}
                            />
                        </div>

                        <div style={{ gridColumn: 'span 2', display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
                                Mark as Featured Event
                            </label>
                        </div>

                        <div style={{ gridColumn: 'span 2' }}>
                            <button type="submit" className="btn btn-accent" style={{ width: '100%', padding: '15px' }}>Publish Movie</button>
                        </div>
                    </form>
                </div>
            )}

            <h3 style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>Collection ({movies.length})</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '40px' }}>
                {movies.map(m => (
                    <div key={m._id} className="movie-card" style={{ position: 'relative', background: '#fff', border: '1px solid #eee' }}>
                        <div style={{ height: '400px', overflow: 'hidden', position: 'relative' }}>
                            {m.poster ? (
                                <img src={m.poster} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>No Image</div>
                            )}
                            <div style={{
                                position: 'absolute', bottom: 0, left: 0, width: '100%',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                                padding: '20px',
                                color: '#fff'
                            }}>
                                <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '5px' }}>{m.title}</h4>
                                <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>{m.featured ? 'Featured' : 'Standard'}</p>
                            </div>
                        </div>

                        <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button className="btn" style={{ fontSize: '0.8rem', padding: '8px 15px' }} onClick={() => handleDelete(m._id)}>Remove</button>
                            <button className="btn btn-accent" style={{ fontSize: '0.8rem', padding: '8px 15px', border: 'none' }}>Edit</button>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default Admin;
