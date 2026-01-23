import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Modal from '../components/Modal';

const Booking = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    // Data State
    const [showtime, setShowtime] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [lockedSeats, setLockedSeats] = useState([]); // Seats currently locked by THIS user

    // UI State
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, provider: '' });

    // Ref to handle auto-refresh interval
    const refreshInterval = useRef(null);

    // Grid Configuration
    const rows = 5;
    const cols = 8;
    const seatsArray = [];
    for (let r = 1; r <= rows; r++) {
        for (let c = 1; c <= cols; c++) {
            seatsArray.push(`${String.fromCharCode(64 + r)}${c}`);
        }
    }

    const providers = [
        { name: 'Telebirr', color: '#00A4E4', logo: 'https://placehold.co/120x50/00A4E4/ffffff?text=telebirr' },
        { name: 'CBE Birr', color: '#880088', logo: 'https://placehold.co/120x50/880088/ffffff?text=CBE+Birr' },
        { name: 'Amole', color: '#003366', logo: 'https://placehold.co/120x50/003366/ffffff?text=Amole' }
    ];

    const fetchShowtime = async () => {
        try {
            // Using ID directly as per new backend route
            const res = await api.get(`/showtimes/${id}`);
            setShowtime(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            showNotification('Failed to load showtime details', 'error');
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = "Gast Cinema - Booking";
        fetchShowtime();

        // Refresh seat map every 10 seconds to show live updates
        refreshInterval.current = setInterval(fetchShowtime, 10000);

        return () => {
            if (refreshInterval.current) clearInterval(refreshInterval.current);
            // Release locks on unmount if any? (Ideally, yes, but for now relying on TTL)
            if (lockedSeats.length > 0) {
                api.post('/bookings/release', { showtimeId: id, seats: lockedSeats }).catch(() => { });
            }
        };
    }, [id]);

    const validatePhone = (p) => {
        // Ethiopian phone validation: Starts with 09, followed by 8 digits
        const regex = /^09\d{8}$/;
        return regex.test(p);
    };

    const handlePhoneChange = (e) => {
        const val = e.target.value;
        if (!/^\d*$/.test(val)) return; // Only numbers
        if (val.length > 10) return;
        setPhone(val);

        if (val.length === 10 && !validatePhone(val)) {
            setPhoneError('Invalid format. Must be 09xxxxxxxx');
        } else {
            setPhoneError('');
        }
    };

    const toggleSeat = (seat) => {
        if (!showtime) return;

        const status = showtime.seats[seat];
        // Cannot toggle if taken or pending (by others)
        // Note: Our showtime.seats map might not have keys for available seats if using default, so check existance
        if (status === 'taken') return;
        if (status === 'pending' && !lockedSeats.includes(seat)) return; // Pending by others

        if (selectedSeats.includes(seat)) {
            setSelectedSeats(selectedSeats.filter(s => s !== seat));
        } else {
            if (selectedSeats.length >= 6) return showNotification("Max 6 seats per booking", "info");
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    const initiateBooking = async (providerName) => {
        if (!user) return navigate('/login');
        if (selectedSeats.length === 0) return showNotification('Select at least one seat', 'error');
        if (!validatePhone(phone)) return setPhoneError('Please enter a valid phone number (09xxxxxxxx)');

        setProcessing(true);
        // 1. Lock seats
        try {
            await api.post('/bookings/lock', { showtimeId: id, seats: selectedSeats });
            setLockedSeats(selectedSeats); // Track locally
            setProcessing(false);
            setConfirmModal({ isOpen: true, provider: providerName });
        } catch (err) {
            setProcessing(false);
            showNotification(err.response?.data?.error || 'Seats no longer available', 'error');
            // Refresh to show which are taken
            fetchShowtime();
            // Remove taken ones from selection
            if (err.response?.data?.seats) {
                setSelectedSeats(selectedSeats.filter(s => !err.response.data.seats.includes(s)));
            }
        }
    };

    const processPayment = async () => {
        setProcessing(true);
        // Simulate API delay, normally this would be a redirect or wait for webhook
        await new Promise(r => setTimeout(r, 2000));

        try {
            const idempotencyKey = `booking-${id}-${user._id}-${Date.now()}`;
            const res = await api.post('/bookings', {
                showtimeId: id,
                seats: selectedSeats,
                paymentProvider: confirmModal.provider,
                phone: phone,
                idempotencyKey
            });

            if (res.data.error) throw new Error(res.data.error);

            setLockedSeats([]); // Clear locks as they are now booked/paid
            navigate('/booking/confirmation', { state: { booking: res.data } });
        } catch (err) {
            console.error(err);
            showNotification(err.response?.data?.error || 'Booking Failed', 'error');
            // Unlock/Release if failed
            api.post('/bookings/release', { showtimeId: id, seats: selectedSeats });
            fetchShowtime();
        } finally {
            setProcessing(false);
            setConfirmModal({ isOpen: false, provider: '' });
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ padding: '40px', textAlign: 'center' }}>
                <div className="skeleton" style={{ width: '200px', height: '30px', margin: '0 auto 20px', background: '#ddd', borderRadius: '4px' }}></div>
                <div className="skeleton" style={{ width: '80%', height: '400px', margin: '0 auto', background: '#f0f0f0', borderRadius: '15px' }}></div>
            </div>
        );
    }

    if (!showtime) return <div className="container">Showtime not found.</div>;

    const movie = showtime.movie;
    const totalPrice = selectedSeats.length * showtime.price;

    return (
        <div className="container" style={{ paddingBottom: '160px', paddingTop: '40px' }}>

            <Modal
                isOpen={confirmModal.isOpen}
                onClose={() => {
                    setConfirmModal({ ...confirmModal, isOpen: false });
                    // Optionally release seats if they strictly close modal knowing they won't pay
                }}
                onConfirm={processPayment}
                title="Confirm Payment"
                message={`
                    Movie: ${movie ? movie.title : 'Ticket'}
                    Seats: ${selectedSeats.join(', ')}
                    Price: ${totalPrice} ETB
                    Phone: ${phone}
                    Provider: ${confirmModal.provider}
                `}
            />

            {/* Breadcrumb & Header */}
            <div style={{ marginBottom: '30px' }}>
                <Link to={`/movie/${movie?._id}`} style={{ color: '#666', textDecoration: 'none', display: 'inline-block', marginBottom: '10px' }}>← Back to Movie</Link>
                <h2 style={{ margin: '0 0 10px' }}>{movie ? movie.title : 'Loading...'}</h2>
                <div style={{ display: 'flex', gap: '20px', color: '#888', fontSize: '0.9rem' }}>
                    <span>📅 {showtime.date}</span>
                    <span>⏰ {showtime.time}</span>
                    <span>📍 {showtime.hall}</span>
                </div>
            </div>

            {/* Screen Visual */}
            <div style={{
                height: '40px',
                width: '60%',
                margin: '0 auto 40px',
                borderTop: '4px solid #D4AF37',
                borderRadius: '50% 50% 0 0',
                boxShadow: '0 -15px 20px rgba(212, 175, 55, 0.1)',
                position: 'relative'
            }}>
                <span style={{ position: 'absolute', width: '100%', textAlign: 'center', top: '10px', color: '#ccc', fontSize: '0.7rem', letterSpacing: '4px' }}>SCREEN</span>
            </div>

            {/* Seat Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gap: '12px',
                maxWidth: '400px',
                margin: '0 auto 50px'
            }}>
                {seatsArray.map(seat => {
                    const status = showtime.seats[seat] || 'available';
                    // Check if pending by SOMEONE ELSE
                    // If locked by me locally, treat as selected/pending-by-me
                    // If status is pending in DB but not in my lockedSeats, it's someone else

                    // Actually, let's simplify: 
                    // status='taken' -> Taken
                    // status='pending' -> Pending (warn)

                    let isTaken = status === 'taken';
                    let isPending = status === 'pending';

                    // If I have it selected, override pending visual for me (make it selected)
                    const isSelected = selectedSeats.includes(seat);

                    let bg = '#fff';
                    let color = '#333';
                    let border = '1px solid #ddd';
                    let cursor = 'pointer';

                    if (isTaken) {
                        bg = '#eee'; color = '#ccc'; border = '1px solid #eee'; cursor = 'not-allowed';
                    } else if (isPending && !isSelected) {
                        // Pending by someone else
                        bg = '#fff3cd'; color = '#856404'; border = '1px solid #ffeeba'; cursor = 'not-allowed';
                    } else if (isSelected) {
                        bg = '#D4AF37'; color = '#fff'; border = '1px solid #D4AF37';
                    }

                    return (
                        <button
                            key={seat}
                            onClick={() => toggleSeat(seat)}
                            disabled={isTaken || (isPending && !isSelected) || processing}
                            aria-label={`Seat ${seat}, ${isTaken ? 'Taken' : isSelected ? 'Selected' : 'Available'}`}
                            className="seat-btn"
                            style={{
                                background: bg,
                                color: color,
                                border: border,
                                borderRadius: '8px',
                                aspectRatio: '1/1',
                                cursor: cursor,
                                fontSize: '0.9rem',
                                opacity: processing ? 0.7 : 1,
                                transition: 'transform 0.1s'
                            }}
                            title={`Seat ${seat}`}
                        >
                            {seat.replace(/[A-Z]/, '')}
                        </button>
                    );
                })}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '40px', flexWrap: 'wrap' }}>
                <LegendItem color="#fff" border="#ddd" label="Available" />
                <LegendItem color="#D4AF37" label="Selected" />
                <LegendItem color="#eee" label="Taken" />
                <LegendItem color="#fff3cd" border="#ffeeba" label="Pending" />
            </div>

            {/* Mobile/Sticky Summary */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                width: '100%',
                background: '#fff',
                borderTop: '1px solid #eee',
                padding: '20px',
                zIndex: 100,
                boxShadow: '0 -5px 20px rgba(0,0,0,0.05)'
            }}>
                <div className="container">
                    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Input Row */}
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <label style={{ fontSize: '0.8rem', color: '#666', marginBottom: '5px', display: 'block' }}>Phone Number (Required)</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    placeholder="09xxxxxxxx"
                                    style={{
                                        width: '100%', padding: '10px 15px', borderRadius: '8px',
                                        border: phoneError ? '1px solid red' : '1px solid #ddd',
                                        outline: 'none', background: '#f9f9f9', fontSize: '1rem'
                                    }}
                                />
                                {phoneError && <span style={{ color: 'red', fontSize: '0.75rem', marginTop: '5px', display: 'block' }}>{phoneError}</span>}
                            </div>

                            <div style={{ textAlign: 'right', minWidth: '120px' }}>
                                <span style={{ display: 'block', fontSize: '0.8rem', color: '#888' }}>TOTAL ({selectedSeats.length})</span>
                                <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 'bold' }}>{totalPrice} ETB</span>
                            </div>
                        </div>

                        {/* Payment Buttons */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px' }}>
                            {providers.map(p => (
                                <button
                                    key={p.name}
                                    onClick={() => initiateBooking(p.name)}
                                    disabled={selectedSeats.length === 0 || !!phoneError || !phone || processing}
                                    style={{
                                        padding: '12px',
                                        background: p.color,
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: (selectedSeats.length === 0 || !!phoneError || !phone || processing) ? 'not-allowed' : 'pointer',
                                        opacity: (selectedSeats.length === 0 || !!phoneError || !phone || processing) ? 0.5 : 1,
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        height: '50px'
                                    }}
                                >
                                    {processing ? 'Processing...' : `Pay ${p.name}`}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

const LegendItem = ({ color, border, label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '15px', height: '15px', background: color, border: border || 'none', borderRadius: '4px' }}></div>
        <span style={{ fontSize: '0.8rem', color: '#666' }}>{label}</span>
    </div>
);

export default Booking;
