import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FaCoffee, FaChair, FaFilm } from 'react-icons/fa';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Gast Cinema - Home";
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

            <section style={{ backgroundColor: '#f9f9f9', padding: '100px 20px', textAlign: 'center', marginTop: '60px' }}>
                <div className="container">
                    <h2 style={{ marginBottom: '60px', fontSize: '2.5rem' }}>The <span style={{ color: '#D4AF37' }}>Gast</span> Experience</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>

                        <div style={{ padding: '40px 30px', background: '#fff', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', transition: 'transform 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <FaFilm style={{ fontSize: '3rem', color: '#D4AF37', marginBottom: '25px' }} />
                            <h3 style={{ marginBottom: '15px' }}>Crystal Clear 4K</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>Witness every detail with our state-of-the-art Sony 4K projection systems. From Hollywood blockbusters to local masterpieces.</p>
                        </div>

                        <div style={{ padding: '40px 30px', background: '#fff', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', transition: 'transform 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <FaChair style={{ fontSize: '3rem', color: '#D4AF37', marginBottom: '25px' }} />
                            <h3 style={{ marginBottom: '15px' }}>Premium Comfort</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>Relax in our reclining leather seats with ample legroom. Designed for the ultimate viewing pleasure for you and your family.</p>
                        </div>

                        <div style={{ padding: '40px 30px', background: '#fff', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', transition: 'transform 0.3s ease' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                            <FaCoffee style={{ fontSize: '3rem', color: '#D4AF37', marginBottom: '25px' }} />
                            <h3 style={{ marginBottom: '15px' }}>Buna & Snacks</h3>
                            <p style={{ color: '#666', lineHeight: '1.6' }}>Enjoy traditional Ethiopian coffee ('Buna') and fresh popcorn. A perfect blend of culture and cinema.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Halls Section */}
            <section style={{ padding: '100px 20px', background: '#fff' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '60px', fontSize: '2.5rem' }}>Our <span style={{ color: '#D4AF37' }}>Halls</span></h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                        {/* Hall 1 */}
                        <div style={{ position: 'relative', height: '400px', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                            <img src="https://images.unsplash.com/photo-1517604931442-71053e3e2e3c?q=80&w=2070&auto=format&fit=crop" alt="The Grand Gast" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="hall-img" />
                            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '30px', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', color: '#fff' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                                    <h3 style={{ color: '#D4AF37', marginBottom: '10px' }}>The Grand Gast</h3>
                                    <span style={{ background: '#D4AF37', color: '#000', padding: '5px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '10px' }}>150 ETB</span>
                                </div>
                                <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Our flagship auditorium featuring massive 4K screens and Dolby Atmos sound for the ultimate blockbuster experience.</p>
                            </div>
                        </div>

                        {/* Hall 2 */}
                        <div style={{ position: 'relative', height: '400px', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                            <img src="https://images.unsplash.com/photo-1543599538-a6c4f6cc5c05?q=80&w=1887&auto=format&fit=crop" alt="Gold Lounge" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="hall-img" />
                            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '30px', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', color: '#fff' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                                    <h3 style={{ color: '#D4AF37', marginBottom: '10px' }}>Gold Lounge</h3>
                                    <span style={{ background: '#D4AF37', color: '#000', padding: '5px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '10px' }}>300 ETB</span>
                                </div>
                                <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>An intimate setting with fully reclining leather seats, waiter service, and exclusive menu options.</p>
                            </div>
                        </div>

                        {/* Hall 3 */}
                        <div style={{ position: 'relative', height: '400px', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                            <img src="https://plus.unsplash.com/premium_photo-1661306437817-8ab34be91e74?q=80&w=2070&auto=format&fit=crop" alt="Director's Cut" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} className="hall-img" />
                            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '30px', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', color: '#fff' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                                    <h3 style={{ color: '#D4AF37', marginBottom: '10px' }}>Director's Cut</h3>
                                    <span style={{ background: '#D4AF37', color: '#000', padding: '5px 10px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '10px' }}>450 ETB</span>
                                </div>
                                <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>A private screening room designed for cinephiles, featuring curated classics and indie gems.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <style>{`
                    .hall-img:hover {
                        transform: scale(1.05);
                    }
                `}</style>
            </section>

            <section style={{ padding: '120px 20px', background: '#000', color: '#fff', textAlign: 'center' }}>
                <div className="container" style={{ maxWidth: '700px' }}>
                    <h2 style={{ marginBottom: '20px', color: '#D4AF37' }}>Never Miss a Premiere</h2>
                    <p style={{ marginBottom: '50px', fontSize: '1.2rem', color: '#ccc', fontWeight: '300' }}>Join our community to get updates on the latest Amharic and International movie releases, exclusive events, and discounts.</p>
                    <form style={{ display: 'flex', gap: '15px', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }} onSubmit={(e) => e.preventDefault()}>
                        <input type="email" placeholder="Enter your email" style={{ flex: '1', minWidth: '280px', padding: '18px 25px', borderRadius: '50px', border: '1px solid #333', outline: 'none', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem' }} />
                        <button className="btn btn-accent" style={{ padding: '18px 40px', borderRadius: '50px', fontSize: '1rem' }}>Subscribe</button>
                    </form>
                </div>
            </section>

        </div>
    );
};

export default Home;
