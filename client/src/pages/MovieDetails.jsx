import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const handleBook = (st) => {
        if (user && user.role === 'admin') {
            showNotification('Admins cannot book tickets due to conflict of interest.', 'error');
            return;
        }
        if (!user) {
            showNotification('Please log in or create an account to book tickets.', 'info');
            navigate('/login', { state: { from: `/booking/${st._id}` } });
            return;
        }
        navigate(`/booking/${st._id}`);
    };

    useEffect(() => {
        api.get(`/movies/${id}`).then(res => {
            setMovie(res.data);
            document.title = res.data ? `Gast Cinema - ${res.data.title}` : "Gast Cinema";
        });
        api.get(`/movies/${id}/showtimes`).then(res => setShowtimes(res.data));
    }, [id]);

    if (!movie) return <div>Loading...</div>;

    return (
        <div className="movie-details" style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '120px 20px 60px',
            position: 'relative',
            minHeight: '100vh'
        }}>
            {/* Background Blur Effect */}
            <img
                src={movie.poster}
                alt=""
                style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    objectFit: 'cover', filter: 'blur(20px) brightness(0.3)',
                    zIndex: -1,
                    pointerEvents: 'none'
                }}
            />

            <div style={{ display: 'flex', gap: '60px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ flex: '0 0 350px', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                    {movie.poster && <img src={movie.poster} alt={movie.title} style={{ width: '100%', height: 'auto', display: 'block' }} />}
                </div>

                <div style={{ flex: '1', color: '#fff' }}>
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '10px', textShadow: '0 2px 10px rgba(0,0,0,0.5)', color: '#fff' }}>{movie.title}</h1>
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', fontSize: '1.1rem', color: '#ccc' }}>
                        {movie.genre && <span>{movie.genre}</span>}
                        {movie.duration && <span>• {Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>}
                    </div>

                    <p style={{ marginBottom: '40px', fontSize: '1.2rem', lineHeight: '1.8', maxWidth: '800px', color: '#ddd' }}>{movie.description}</p>

                    <h3 style={{ marginBottom: '20px', color: '#D4AF37', borderBottom: '1px solid rgba(212, 175, 55, 0.3)', paddingBottom: '10px', display: 'inline-block' }}>Select Showtime</h3>

                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        {showtimes.length > 0 ? showtimes.map(st => {
                            let borderColor = 'rgba(255,255,255,0.2)';
                            let textColor = '#D4AF37';
                            if (st.price >= 300) { borderColor = '#D4AF37'; textColor = '#FFD700'; } // Gold/Premium

                            return (
                                <button key={st._id} onClick={() => handleBook(st)} className="btn" style={{
                                    fontWeight: 'bold',
                                    background: 'rgba(0,0,0,0.5)',
                                    color: '#fff',
                                    border: `1px solid ${borderColor}`,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    padding: '15px 25px',
                                    textDecoration: 'none',
                                    cursor: 'pointer',
                                    minWidth: '120px'
                                }}>
                                    <span style={{ fontSize: '1.4rem', marginBottom: '5px' }}>{st.time}</span>
                                    <span style={{ fontSize: '0.8rem', color: '#ccc', marginBottom: '5px' }}>{st.date}</span>
                                    <span style={{ fontSize: '0.8rem', color: textColor, textTransform: 'uppercase', letterSpacing: '1px' }}>{st.hall || 'Standard'}</span>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold', marginTop: '5px' }}>{st.price} ETB</span>
                                </button>
                            );
                        }) : <p>No showtimes available.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
