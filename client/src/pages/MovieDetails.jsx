import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);

    useEffect(() => {
        api.get(`/movies/${id}`).then(res => {
            setMovie(res.data);
            document.title = res.data ? `Gast Cinema - ${res.data.title}` : "Gast Cinema";
        });
        api.get(`/movies/${id}/showtimes`).then(res => setShowtimes(res.data));
    }, [id]);

    if (!movie) return <div>Loading...</div>;

    return (
        <div className="movie-details">
            <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
                <div style={{ flex: '1', height: '400px', background: '#f5f5f5' }}>
                    {movie.poster && <img src={movie.poster} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
                <div style={{ flex: '2' }}>
                    <h1>{movie.title}</h1>
                    <p style={{ margin: '20px 0', fontSize: '1.1rem' }}>{movie.description}</p>

                    <h3>Showtimes</h3>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {showtimes.map(st => (
                            <Link key={st._id} to={`/booking/${st._id}`} className="btn" style={{ fontWeight: 'normal' }}>
                                {st.date} - {st.time} ({st.price} ETB)
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
