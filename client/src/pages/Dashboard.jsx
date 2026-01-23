import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Dashboard = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        document.title = "Gast Cinema - My Tickets";
        api.get('/bookings').then(res => setBookings(res.data)).catch(console.error);
    }, []);

    return (
        <div>
            <h2>My Tickets</h2>
            {bookings.length === 0 ? <p>No bookings found.</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
                    {bookings.map(booking => (
                        <div key={booking._id} style={{
                            background: '#fff',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                            display: 'flex',
                            position: 'relative'
                        }}>
                            {/* Main Ticket Info */}
                            <div style={{ flex: 1, padding: '25px' }}>
                                <div style={{ marginBottom: '15px' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Booking #{booking._id.slice(-6)}</h3>
                                    <span style={{ fontSize: '0.8rem', color: '#888' }}>{new Date().toLocaleDateString()}</span>
                                </div>

                                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                    <div>
                                        <span style={{ display: 'block', fontSize: '0.7rem', color: '#888', textTransform: 'uppercase' }}>Seats</span>
                                        <span style={{ fontWeight: 'bold' }}>{booking.seats.join(', ')}</span>
                                    </div>
                                    <div>
                                        <span style={{ display: 'block', fontSize: '0.7rem', color: '#888', textTransform: 'uppercase' }}>Amount</span>
                                        <span style={{ fontWeight: 'bold' }}>{booking.totalPrice} ETB</span>
                                    </div>
                                </div>

                                <div>
                                    <span style={{
                                        padding: '5px 12px',
                                        borderRadius: '20px',
                                        background: booking.status === 'confirmed' ? '#e6f4ea' : '#fff3cd',
                                        color: booking.status === 'confirmed' ? '#1e7e34' : '#856404',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase'
                                    }}>
                                        {booking.status || 'Confirmed'}
                                    </span>
                                </div>
                            </div>

                            {/* Dotted Line */}
                            <div style={{
                                width: '2px',
                                backgroundSize: '2px 10px',
                                backgroundImage: 'linear-gradient(to bottom, #ddd 50%, transparent 50%)',
                                position: 'relative'
                            }}>
                                <div style={{ position: 'absolute', top: '-10px', left: '-10px', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--color-bg)' }}></div>
                                <div style={{ position: 'absolute', bottom: '-10px', left: '-10px', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--color-bg)' }}></div>
                            </div>

                            {/* QR Code Section */}
                            <div style={{ width: '100px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${booking._id}`} alt="QR" style={{ width: '100%', opacity: 0.8 }} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
