import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Home = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        api.get('/movies').then(res => setMovies(res.data)).catch(console.error);
    }, []);

    return (
        <div>
            <section className="hero">
                <h1>GAST CINEMA</h1>
                <p>Experience Cinema in Minimalist Luxury.</p>
                <button className="btn btn-accent" onClick={() => document.getElementById('now-showing').scrollIntoView({ behavior: 'smooth' })}>
                    Browse Movies
                </button>
            </section>

            <div id="now-showing" className="container" style={{ paddingBottom: '60px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '40px', display: 'block' }}>Now Showing</h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
                    {movies.map(movie => (
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
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
