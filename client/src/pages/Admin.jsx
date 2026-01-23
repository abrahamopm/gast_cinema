import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNotification } from '../context/NotificationContext';
import Modal from '../components/Modal';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('movies'); // movies | showtimes
    const [movies, setMovies] = useState([]);
    const [showtimes, setShowtimes] = useState([]);
    const [selectedMovieId, setSelectedMovieId] = useState(null); // For showtime filtering
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Forms
    const [movieForm, setMovieForm] = useState({ title: '', description: '', poster: '', trailer: '', genre: '', duration: '', featured: false });
    const [showtimeForm, setShowtimeForm] = useState({ date: '', time: '', hall: 'The Grand Gast', price: 150 });

    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

    const { showNotification } = useNotification();

    const hallOptions = ["The Grand Gast", "Gold Lounge", "Director's Cut"];

    useEffect(() => {
        document.title = "Gast Cinema - Admin Portal";
        fetchBaseData();
    }, []);

    // Fetch showtimes when a movie is selected
    useEffect(() => {
        if (activeTab === 'showtimes' && selectedMovieId) {
            fetchShowtimes(selectedMovieId);
        }
    }, [selectedMovieId, activeTab]);

    const fetchBaseData = async () => {
        try {
            const [moviesRes, statsRes] = await Promise.all([
                api.get('/movies'),
                api.get('/admin/stats')
            ]);
            setMovies(moviesRes.data);
            setStats(statsRes.data);
            setLoading(false);

            // Default selection for showtimes
            if (moviesRes.data.length > 0 && !selectedMovieId) setSelectedMovieId(moviesRes.data[0]._id);

        } catch (err) {
            showNotification('Failed to load dashboard data', 'error');
            setLoading(false);
        }
    };

    const fetchShowtimes = async (movieId) => {
        try {
            const res = await api.get(`/movies/${movieId}/showtimes`);
            setShowtimes(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    // --- Movie Handlers ---
    const handleMovieSubmit = async (e) => {
        e.preventDefault();
        try {
            let res;
            if (editingId) {
                res = await api.put(`/movies/${editingId}`, movieForm);
                showNotification('Movie Updated Successfully', 'success');
            } else {
                res = await api.post('/movies', movieForm);
                showNotification('Movie Added Successfully', 'success');
            }
            await fetchBaseData();
            resetForms();
            setSelectedMovieId(res.data._id); // Auto-select for showtime addition
        } catch (err) {
            showNotification('Operation Failed', 'error');
        }
    };

    const deleteMovie = async (id) => {
        try {
            await api.delete(`/movies/${id}`);
            showNotification('Movie Removed', 'success');
            fetchBaseData();
        } catch (err) {
            showNotification('Delete Failed', 'error');
        }
    };

    // --- Showtime Handlers ---
    const handleShowtimeSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...showtimeForm, movie: selectedMovieId };
            await api.post('/showtimes', payload);
            showNotification('Showtime Created Successfully', 'success');
            resetForms();
            fetchShowtimes(selectedMovieId);
        } catch (err) {
            showNotification('Failed to create showtime', 'error');
        }
    };

    const deleteShowtime = async (id) => {
        try {
            await api.delete(`/showtimes/${id}`); // Ensure this route exists on backend
            showNotification('Showtime Removed', 'success');
            fetchShowtimes(selectedMovieId);
        } catch (err) {
            showNotification('Failed to remove showtime', 'error');
        }
    };

    const resetForms = () => {
        setMovieForm({ title: '', description: '', poster: '', trailer: '', genre: '', duration: '', featured: false });
        setShowtimeForm({ date: '', time: '', hall: 'The Grand Gast', price: 150 });
        setIsAdding(false);
        setEditingId(null);
    };

    const openDeleteModal = (title, message, action) => {
        setModal({ isOpen: true, title, message, onConfirm: action });
    };

    return (
        <div style={{ paddingTop: '40px', paddingBottom: '100px', background: '#f9f9f9', minHeight: '100vh' }}>
            <Modal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                onConfirm={modal.onConfirm}
                title={modal.title}
                message={modal.message}
            />

            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h2 style={{ fontSize: '2rem' }}>Admin Portal</h2>
                        <p style={{ color: '#666' }}>Manage Movies, Showtimes & Analytics</p>
                    </div>

                    <div style={{ display: 'flex', gap: '20px' }}>
                        {/* Stats Cards Small */}
                        {stats && (
                            <div style={{ display: 'flex', gap: '30px' }}>
                                <div>
                                    <span style={{ display: 'block', fontSize: '0.8rem', color: '#888', textTransform: 'uppercase' }}>Revenue</span>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{parsedRevenue(stats.totalRevenue)}</span>
                                </div>
                                <div>
                                    <span style={{ display: 'block', fontSize: '0.8rem', color: '#888', textTransform: 'uppercase' }}>Tickets</span>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{stats.totalTickets}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid #ddd', marginBottom: '40px' }}>
                    <button
                        onClick={() => { setActiveTab('movies'); setIsAdding(false); }}
                        style={{ padding: '15px 30px', border: 'none', background: 'none', borderBottom: activeTab === 'movies' ? '3px solid #D4AF37' : '3px solid transparent', fontWeight: 'bold', fontSize: '1rem', color: activeTab === 'movies' ? '#000' : '#888' }}
                    >
                        Manage Movies
                    </button>
                    <button
                        onClick={() => { setActiveTab('showtimes'); setIsAdding(false); }}
                        style={{ padding: '15px 30px', border: 'none', background: 'none', borderBottom: activeTab === 'showtimes' ? '3px solid #D4AF37' : '3px solid transparent', fontWeight: 'bold', fontSize: '1rem', color: activeTab === 'showtimes' ? '#000' : '#888' }}
                    >
                        Manage Showtimes
                    </button>
                </div>

                {/* --- MOVIES TAB --- */}
                {activeTab === 'movies' && (
                    <>
                        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                            <button className="btn btn-accent" onClick={() => setIsAdding(!isAdding)}>
                                {isAdding ? 'Close Form' : '+ Add New Movie'}
                            </button>
                        </div>

                        {isAdding && (
                            <div className="form-card">
                                <h3>{editingId ? 'Edit Movie' : 'Add New Movie'}</h3>
                                <form onSubmit={handleMovieSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <input placeholder="Title" value={movieForm.title} onChange={e => setMovieForm({ ...movieForm, title: e.target.value })} required className="input-field" style={{ gridColumn: 'span 2' }} />
                                    <textarea placeholder="Description" value={movieForm.description} onChange={e => setMovieForm({ ...movieForm, description: e.target.value })} className="input-field" style={{ gridColumn: 'span 2' }} rows="3" />
                                    <input placeholder="Poster URL" value={movieForm.poster} onChange={e => setMovieForm({ ...movieForm, poster: e.target.value })} className="input-field" />
                                    <input placeholder="Trailer URL" value={movieForm.trailer} onChange={e => setMovieForm({ ...movieForm, trailer: e.target.value })} className="input-field" />
                                    <input placeholder="Genre (e.g Sci-Fi)" value={movieForm.genre} onChange={e => setMovieForm({ ...movieForm, genre: e.target.value })} className="input-field" />
                                    <input type="number" placeholder="Duration (min)" value={movieForm.duration} onChange={e => setMovieForm({ ...movieForm, duration: e.target.value })} className="input-field" />

                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <input type="checkbox" checked={movieForm.featured} onChange={e => setMovieForm({ ...movieForm, featured: e.target.checked })} /> Featured
                                    </label>

                                    <button type="submit" className="btn btn-accent" style={{ gridColumn: 'span 2' }}>{editingId ? 'Update' : 'Publish'}</button>
                                </form>
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px' }}>
                            {movies.map(m => (
                                <div key={m._id} style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                                    <div style={{ height: '300px' }}>
                                        <img src={m.poster || 'https://via.placeholder.com/300x450'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={m.title} />
                                    </div>
                                    <div style={{ padding: '15px' }}>
                                        <h4 style={{ margin: '0 0 10px 0' }}>{m.title}</h4>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <button className="btn" style={{ fontSize: '0.8rem', padding: '5px 10px' }} onClick={() => {
                                                setMovieForm({ ...m, trailer: m.trailer || '', genre: m.genre || '', duration: m.duration || '' });
                                                setEditingId(m._id);
                                                setIsAdding(true);
                                                window.scrollTo(0, 0);
                                            }}>Edit</button>
                                            <button style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => openDeleteModal('Delete Movie', 'Are you sure?', () => deleteMovie(m._id))}>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* --- SHOWTIMES TAB --- */}
                {activeTab === 'showtimes' && (
                    <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
                        {/* Sidebar: Movie Selector */}
                        <div style={{ width: '300px', background: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ marginBottom: '20px' }}>Select Movie</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {movies.map(m => (
                                    <button
                                        key={m._id}
                                        onClick={() => setSelectedMovieId(m._id)}
                                        style={{
                                            padding: '10px',
                                            textAlign: 'left',
                                            background: selectedMovieId === m._id ? '#eee' : 'transparent',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontWeight: selectedMovieId === m._id ? 'bold' : 'normal'
                                        }}
                                    >
                                        {m.title}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Main: Showtimes List & Add */}
                        <div style={{ flex: 1 }}>
                            <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', marginBottom: '30px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
                                <h3>Add Showtime</h3>
                                <form onSubmit={handleShowtimeSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', alignItems: 'end' }}>
                                    <div>
                                        <label style={{ fontSize: '0.8rem' }}>Date</label>
                                        <input type="date" value={showtimeForm.date} onChange={e => setShowtimeForm({ ...showtimeForm, date: e.target.value })} required className="input-field" />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem' }}>Time</label>
                                        <input type="time" value={showtimeForm.time} onChange={e => setShowtimeForm({ ...showtimeForm, time: e.target.value })} required className="input-field" />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem' }}>Hall</label>
                                        <select value={showtimeForm.hall} onChange={e => setShowtimeForm({ ...showtimeForm, hall: e.target.value })} className="input-field" style={{ height: '48px' }}>
                                            {hallOptions.map(h => <option key={h} value={h}>{h}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8rem' }}>Price (ETB)</label>
                                        <input type="number" value={showtimeForm.price} onChange={e => setShowtimeForm({ ...showtimeForm, price: e.target.value })} required className="input-field" />
                                    </div>
                                    <button type="submit" className="btn btn-accent" style={{ gridColumn: 'span 4' }}>Create Showtime</button>
                                </form>
                            </div>

                            <h3>Schedule for {movies.find(m => m._id === selectedMovieId)?.title}</h3>
                            {showtimes.length === 0 ? <p>No showtimes scheduled.</p> : (
                                <div style={{ display: 'grid', gap: '15px' }}>
                                    {showtimes.map(st => (
                                        <div key={st._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '15px 20px', borderRadius: '8px', borderLeft: '4px solid #D4AF37' }}>
                                            <div>
                                                <strong style={{ fontSize: '1.1rem' }}>{st.time}</strong>
                                                <span style={{ margin: '0 15px', color: '#888' }}>|</span>
                                                <span>{st.date}</span>
                                                <span style={{ margin: '0 15px', color: '#888' }}>|</span>
                                                <span style={{ color: '#D4AF37', fontWeight: 'bold' }}>{st.hall}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                                <strong>{st.price} ETB</strong>
                                                <button onClick={() => openDeleteModal('Delete Showtime', 'Rule cancel?', () => deleteShowtime(st._id))} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>&times;</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .input-field {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    outline: none;
                }
                .input-field:focus {
                    border-color: #D4AF37;
                }
                .form-card {
                    background: #fff;
                    padding: 30px;
                    border-radius: 8px;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.05);
                    marginBottom: 40px;
                }
            `}</style>
        </div>
    );
};

const parsedRevenue = (rev) => {
    return new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB' }).format(rev);
}

export default Admin;
