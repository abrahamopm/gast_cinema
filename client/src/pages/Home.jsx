import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/movies')
            .then(res => {
                setMovies(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div>
            <section className="hero" style={{
                position: 'relative',
                backgroundImage: 'url("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: '#fff',
                padding: '160px 20px',
                marginBottom: '60px'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.6)', // Dark overlay for readability
                    zIndex: 1
                }}></div>

                <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'inline-block', border: '2px solid #D4AF37', padding: '10px 30px', marginBottom: '20px', background: 'rgba(0,0,0,0.5)' }}>
                        <h1 style={{ color: '#fff', textShadow: '0 4px 10px rgba(0,0,0,0.3)', margin: 0, fontSize: '4rem' }}>GAST <span style={{ color: '#D4AF37' }}>CINEMA</span></h1>
                    </div>
                    <p style={{ color: '#eee', fontSize: '1.4rem', fontWeight: '300' }}>Experience Cinema in Minimalist Luxury.</p>
                    <button className="btn btn-accent" onClick={() => document.getElementById('now-showing').scrollIntoView({ behavior: 'smooth' })}>
                        Browse Movies
                    </button>
                </div>
            </section>

            <div id="now-showing" className="container" style={{ paddingBottom: '60px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '40px', display: 'block' }}>Now Showing</h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
                    {loading ? (
                        // Skeleton Loading State
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="movie-card skeleton-card skeleton"></div>
                        ))
                    ) : (
                        movies.map(movie => (
                            <div key={movie._id} className="movie-card" style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ position: 'relative', paddingTop: '150%', overflow: 'hidden', borderRadius: '8px', marginBottom: '20px' }}>
                                    {movie.poster ? (
                                        <img src={movie.poster} alt={movie.title} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#eee' }} />
                                    )}
                                </div>

                                <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>{movie.title}</h3>
                                {movie.featured && <span style={{ textTransform: 'uppercase', fontSize: '0.7rem', color: '#D4AF37', fontWeight: 'bold', marginBottom: '10px', display: 'block' }}>Featured Event</span>}

                                <div style={{ marginTop: 'auto' }}>
                                    <Link to={`/movie/${movie._id}`} className="btn" style={{ display: 'block', textAlign: 'center' }}>
                                        Book Tickets
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
