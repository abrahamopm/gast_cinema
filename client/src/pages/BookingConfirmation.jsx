import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

const BookingConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { booking } = location.state || {};

    useEffect(() => {
        if (!booking) {
            navigate('/dashboard');
        }
    }, [booking, navigate]);

    if (!booking) return null;

    return (
        <div style={{
            maxWidth: '600px',
            margin: '100px auto',
            padding: '40px',
            background: '#fff',
            borderRadius: '15px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            textAlign: 'center'
        }}>
            <div style={{
                width: '80px',
                height: '80px',
                background: '#e6f4ea',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                color: '#1e7e34',
                fontSize: '2rem'
            }}>
                ✓
            </div>

            <h1 style={{ marginBottom: '10px', color: '#333' }}>Booking Confirmed!</h1>
            <p style={{ color: '#666', marginBottom: '30px' }}>Your tickets have been successfully booked.</p>

            <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '30px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                    <span style={{ color: '#888' }}>Booking Ref</span>
                    <span style={{ fontWeight: 'bold' }}>#{booking._id.slice(-8).toUpperCase()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ color: '#888' }}>Showtime ID</span>
                    <span style={{ fontWeight: 'bold' }}>{booking.showtime}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ color: '#888' }}>Seats</span>
                    <span style={{ fontWeight: 'bold' }}>{booking.seats.join(', ')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                    <span style={{ color: '#888' }}>Total Paid</span>
                    <span style={{ fontWeight: 'bold', color: '#1e7e34', fontSize: '1.2rem' }}>{booking.totalPrice} ETB</span>
                </div>
                <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#888', fontStyle: 'italic' }}>
                    Provided Phone: {booking.phone}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <Link to="/dashboard" className="btn" style={{ background: '#D4AF37', color: '#fff', textDecoration: 'none', padding: '12px 25px', borderRadius: '8px' }}>
                    View My Tickets
                </Link>
                <Link to="/" className="btn" style={{ background: '#fff', color: '#333', border: '1px solid #ddd', textDecoration: 'none', padding: '12px 25px', borderRadius: '8px' }}>
                    Back to Movies
                </Link>
            </div>
        </div>
    );
};

export default BookingConfirmation;
