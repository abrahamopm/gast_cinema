import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Modal from '../components/Modal';

const Booking = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [showtime, setShowtime] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState('');

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, provider: '' });

    // Logos configuration
    const providers = [
        { name: 'Telebirr', color: '#00A4E4', logo: 'https://placehold.co/120x50/00A4E4/ffffff?text=telebirr' },
        { name: 'CBE Birr', color: '#880088', logo: 'https://placehold.co/120x50/880088/ffffff?text=CBE+Birr' },
        { name: 'Amole', color: '#003366', logo: 'https://placehold.co/120x50/003366/ffffff?text=Amole' }
    ];

    // Grid Configuration
    const rows = 5;
    const cols = 8;
    const seatsArray = [];
    for (let r = 1; r <= rows; r++) {
        for (let c = 1; c <= cols; c++) {
            seatsArray.push(`${String.fromCharCode(64 + r)}${c}`);
        }
    }

    useEffect(() => {
        api.get(`/movies/${id}/showtimes`).then(() => {
            // Mock for now including movie title handling
            setShowtime({
                _id: id,
                price: 150,
                seats: { 'A1': 'taken', 'B3': 'taken' },
            });
        });
    }, [id]);

    const toggleSeat = (seat) => {
        if (showtime.seats[seat] === 'taken') return;
        if (selectedSeats.includes(seat)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seat));
        } else {
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    const initiatePayment = (providerName) => {
        if (!user) return showNotification('Please Login first', 'error');
        if (selectedSeats.length === 0) return showNotification('Select at least one seat', 'error');
        if (!phone) return showNotification('Please enter your phone number', 'error');

        setConfirmModal({ isOpen: true, provider: providerName });
    }

    const processPayment = async () => {
        setLoading(true);
        // Simulate API delay
        await new Promise(r => setTimeout(r, 2000));

        try {
            await api.post('/bookings', {
                showtimeId: id,
                seats: selectedSeats,
                paymentProvider: confirmModal.provider,
                phone: phone
            });
            showNotification(`Payment Successful via ${confirmModal.provider}!`, 'success');
            navigate('/dashboard');
        } catch (err) {
            showNotification('Payment Failed', 'error');
        } finally {
            setLoading(false);
            setConfirmModal({ isOpen: false, provider: '' });
        }
    };

    if (!showtime) return <div className="container" style={{ padding: '40px' }}>Loading Showtime...</div>;

    return (
        <div className="container" style={{ paddingBottom: '120px' }}>

            {/* Confirmation Modal */}
            <Modal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={processPayment}
                title="Confirm Your Booking"
                message={`
             Movie Ticket for ${selectedSeats.length} person(s).
             Seats: ${selectedSeats.join(', ')}
             Total Price: ${selectedSeats.length * showtime.price} ETB
             Phone: ${phone}
             Payment Method: ${confirmModal.provider}
             
             Proceed to payment?
          `}
            />

            <h2 style={{ textAlign: 'center', margin: '40px 0' }}>Select Your Seats</h2>

            {/* Screen Visual */}
            <div style={{
                height: '8px',
                background: '#ddd',
                width: '80%',
                margin: '0 auto 40px',
                borderRadius: '50%',
                boxShadow: '0 10px 20px -5px rgba(0,0,0,0.2)'
            }}></div>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#888', marginBottom: '30px' }}>SCREEN</p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gap: '12px',
                marginBottom: '40px',
                maxWidth: '400px',
                margin: '0 auto 40px'
            }}>
                {seatsArray.map(seat => {
                    const isTaken = showtime.seats[seat] === 'taken';
                    const isSelected = selectedSeats.includes(seat);
                    let bg = '#fff';
                    let color = '#000';
                    if (isTaken) { bg = '#1a1a1a'; color = '#444'; }
                    if (isSelected) { bg = '#D4AF37'; color = '#000'; }

                    return (
                        <div key={seat} style={{ position: 'relative' }} className="seat-wrapper">
                            <button
                                onClick={() => toggleSeat(seat)}
                                disabled={isTaken}
                                className="seat-btn"
                                style={{
                                    background: bg,
                                    color: color,
                                    border: isTaken ? 'none' : '1px solid #000',
                                    borderRadius: '6px',
                                    cursor: isTaken ? 'not-allowed' : 'pointer',
                                    width: '100%',
                                    aspectRatio: '1/1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    boxShadow: isSelected ? '0 0 15px rgba(212, 175, 55, 0.5)' : 'none'
                                }}
                            >
                                {seat}
                            </button>

                            <div className="tooltip">
                                {isTaken ? 'Has Taken' : `Row ${seat.charAt(0)} - Seat ${seat.slice(1)}`}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '15px', height: '15px', border: '1px solid #000', borderRadius: '3px' }}></div>
                    <span style={{ fontSize: '0.8rem' }}>Available</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '15px', height: '15px', background: '#D4AF37', borderRadius: '3px' }}></div>
                    <span style={{ fontSize: '0.8rem' }}>Selected</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '15px', height: '15px', background: '#1a1a1a', borderRadius: '3px' }}></div>
                    <span style={{ fontSize: '0.8rem' }}>Taken</span>
                </div>
            </div>

            {/* Sticky Summary */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                width: '100%',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                borderTop: '1px solid #eee',
                padding: '20px 0',
                zIndex: 100,
                boxShadow: '0 -4px 20px rgba(0,0,0,0.05)'
            }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <input
                            type="tel"
                            placeholder="Enter Phone (Required)"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            style={{
                                width: '100%', padding: '10px',
                                border: '1px solid #ddd', borderRadius: '4px',
                                fontSize: '0.9rem'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ display: 'block', fontSize: '0.8rem', color: '#666' }}>TOTAL</span>
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{selectedSeats.length * showtime.price} ETB</span>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            {providers.map(p => (
                                <button
                                    key={p.name}
                                    onClick={() => initiatePayment(p.name)}
                                    className="btn"
                                    disabled={loading || selectedSeats.length === 0}
                                    style={{
                                        padding: 0,
                                        border: 'none',
                                        opacity: selectedSeats.length === 0 ? 0.5 : 1,
                                        transition: 'transform 0.2s',
                                        overflow: 'hidden',
                                        borderRadius: '4px'
                                    }}
                                    title={`Pay with ${p.name}`}
                                >
                                    <img src={p.logo} alt={p.name} style={{ height: '50px', display: 'block' }} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .seat-wrapper:hover .tooltip {
          opacity: 1;
          transform: translateX(-50%) translateY(-5px);
        }
        .tooltip {
          pointer-events: none;
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(0);
          background: #000;
          color: #fff;
          padding: 5px 10px;
          border-radius: 4px;
          font-size: 0.7rem;
          white-space: nowrap;
          opacity: 0;
          transition: all 0.2s ease;
          z-index: 10;
        }
        .btn:hover img {
           transform: scale(1.05);
        }
      `}</style>
        </div>
    );
};

export default Booking;
