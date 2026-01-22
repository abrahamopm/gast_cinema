import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Dashboard = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        api.get('/bookings').then(res => setBookings(res.data)).catch(console.error);
    }, []);

    return (
        <div>
            <h2>My Tickets</h2>
            {bookings.length === 0 ? <p>No bookings found.</p> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {bookings.map(booking => (
                        <div key={booking._id} style={{ border: '1px solid #000', padding: '20px', display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <h3>Booking #{booking._id.slice(-6)}</h3>
                                <p>Seats: {booking.seats.join(', ')}</p>
                                <p>Payment: {booking.paymentProvider}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{booking.totalPrice} ETB</p>
                                <span style={{ background: '#D4AF37', padding: '5px 10px', fontSize: '0.8rem' }}>{booking.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
