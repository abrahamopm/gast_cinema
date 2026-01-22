import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const Booking = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const [showtime, setShowtime] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(false);

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
            // Mock data as before
            setShowtime({
                _id: id,
                price: 150,
                seats: { 'A1': 'taken', 'B3': 'taken' }
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

    const handlePayment = async (provider) => {
        if (!user) return showNotification('Please Login first', 'error');
        setLoading(true);
        // Simulate API delay
        await new Promise(r => setTimeout(r, 2000));

        try {
            await api.post('/bookings', {
                showtimeId: id,
                seats: selectedSeats,
                paymentProvider: provider
            });
            showNotification(`Payment Successful via ${provider}!`, 'success');
            navigate('/dashboard');
        } catch (err) {
            showNotification('Payment Failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!showtime) return <div>Loading Showtime...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2>Select Seats</h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gap: '10px',
                marginBottom: '40px',
                maxWidth: '400px',
                margin: '0 auto 40px'
            }}>
                {seatsArray.map(seat => {
                    const isTaken = showtime.seats[seat] === 'taken';
                    const isSelected = selectedSeats.includes(seat);
                    let bg = '#fff';
                    let color = '#000';
                    if (isTaken) { bg = '#000'; color = '#fff'; }
                    if (isSelected) { bg = '#D4AF37'; color = '#000'; }

                    return (
                        <button key={seat}
                            onClick={() => toggleSeat(seat)}
                            disabled={isTaken}
                            className="seat-btn" // Added class for better animation reference
                            style={{
                                background: bg,
                                color: color,
                                border: '1px solid #000',
                                borderRadius: '4px',
                                cursor: isTaken ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {seat}
                        </button>
                    );
                })}
            </div>

            <div style={{ borderTop: '1px solid #ccc', paddingTop: '20px' }}>
                <h3>Total: {selectedSeats.length * showtime.price} ETB</h3>

                <h4>Pay With:</h4>
                <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                    {['Telebirr', 'CBE Birr', 'Amole'].map(provider => (
                        <button
                            key={provider}
                            onClick={() => handlePayment(provider)}
                            className="btn"
                            disabled={loading || selectedSeats.length === 0}
                            style={{ flex: 1 }}
                        >
                            {loading ? 'Processing...' : provider}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Booking;
