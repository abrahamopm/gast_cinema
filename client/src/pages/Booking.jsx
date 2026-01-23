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
        document.title = "Gast Cinema - Booking";
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
        <div className="container" style={{ paddingBottom: '140px', paddingTop: '100px' }}>

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

            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Select Your Seats</h2>
            <p style={{ textAlign: 'center', marginBottom: '40px', color: '#666' }}>Tap on seats to select or deselect.</p>

            {/* Screen Visual */}
            <div style={{
                height: '60px',
                width: '80%',
                margin: '0 auto 50px',
                borderTop: '5px solid #D4AF37',
                borderRadius: '50% 50% 0 0 / 20px 20px 0 0',
                boxShadow: '0 -20px 30px rgba(212, 175, 55, 0.2)',
                position: 'relative'
            }}>
                <span style={{ position: 'absolute', width: '100%', textAlign: 'center', top: '20px', color: '#ccc', fontSize: '0.8rem', letterSpacing: '4px' }}>SCREEN</span>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gap: '15px',
                marginBottom: '60px',
                maxWidth: '450px',
                margin: '0 auto 60px'
            }}>
                {seatsArray.map(seat => {
                    const isTaken = showtime.seats[seat] === 'taken';
                    const isSelected = selectedSeats.includes(seat);
                    let bg = '#fff';
                    let color = '#000';
                    let border = '1px solid #ddd';

                    if (isTaken) { bg = '#eee'; color = '#ccc'; border = 'none'; }
                    if (isSelected) { bg = '#D4AF37'; color = '#fff'; border = 'none'; }

                    return (
                        <div key={seat} style={{ position: 'relative' }} className="seat-wrapper">
                            <button
                                onClick={() => toggleSeat(seat)}
                                disabled={isTaken}
                                className="seat-btn"
                                style={{
                                    background: bg,
                                    color: color,
                                    border: border,
                                    borderRadius: '8px',
                                    cursor: isTaken ? 'not-allowed' : 'pointer',
                                    width: '100%',
                                    aspectRatio: '1/1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 'bold',
                                    boxShadow: isSelected ? '0 5px 15px rgba(212, 175, 55, 0.4)' : 'none',
                                    transform: isSelected ? 'scale(1.1)' : 'scale(1)'
                                }}
                            >
                                {seat.replace(/[A-Z]/, '')}
                            </button>
                            <div className="tooltip">
                                Row {seat.charAt(0)}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '20px', height: '20px', border: '1px solid #ddd', borderRadius: '4px', background: '#fff' }}></div>
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>Available</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '20px', height: '20px', background: '#D4AF37', borderRadius: '4px' }}></div>
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>Selected</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '20px', height: '20px', background: '#eee', borderRadius: '4px' }}></div>
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>Taken</span>
                </div>
            </div>

            {/* Sticky Summary */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                width: '100%',
                background: '#fff',
                borderTop: '1px solid #eee',
                padding: '20px 0',
                zIndex: 100,
                boxShadow: '0 -10px 40px rgba(0,0,0,0.1)'
            }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px', color: '#666' }}>Your Phone Number (For Tickets)</label>
                        <input
                            type="tel"
                            placeholder="e.g 0911223344"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            style={{
                                width: '100%', padding: '12px 15px',
                                border: '1px solid #ddd', borderRadius: '8px',
                                fontSize: '1rem', outline: 'none',
                                background: '#f9f9f9'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '30px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ textAlign: 'right', minWidth: '100px' }}>
                            <span style={{ display: 'block', fontSize: '0.8rem', color: '#888' }}>TOTAL PRICE</span>
                            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#000' }}>{selectedSeats.length * showtime.price} <span style={{ fontSize: '1rem', color: '#888' }}>ETB</span></span>
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            {providers.map(p => (
                                <button
                                    key={p.name}
                                    onClick={() => initiatePayment(p.name)}
                                    className="btn"
                                    disabled={loading || selectedSeats.length === 0}
                                    style={{
                                        padding: '0',
                                        border: 'none',
                                        opacity: selectedSeats.length === 0 ? 0.4 : 1,
                                        transition: 'all 0.3s',
                                        overflow: 'hidden',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                        height: '50px'
                                    }}
                                    title={`Pay with ${p.name}`}
                                >
                                    <img src={p.logo} alt={p.name} style={{ height: '100%', display: 'block' }} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .seat-wrapper:hover .tooltip {
          opacity: 1;
          transform: translateX(-50%) translateY(-10px);
        }
        .tooltip {
          pointer-events: none;
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(0);
          background: #333;
          color: #fff;
          padding: 6px 10px;
          border-radius: 4px;
          font-size: 0.75rem;
          white-space: nowrap;
          opacity: 0;
          transition: all 0.2s ease;
          z-index: 10;
        }
        .tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: #333 transparent transparent transparent;
        }
      `}</style>
        </div>
    );
};

export default Booking;
