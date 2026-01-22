import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            background: '#000',
            color: '#fff',
            padding: '60px 0',
            marginTop: '60px'
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px' }}>
                <div>
                    <h2 style={{ color: '#fff', marginBottom: '20px' }}>GAST CINEMA</h2>
                    <p style={{ color: '#888', maxWidth: '300px' }}>Experience movies in uncompromising luxury and comfort. Join the exclusive club of cinema lovers.</p>
                </div>

                <div>
                    <h4 style={{ color: '#D4AF37', marginBottom: '20px' }}>Quick Links</h4>
                    <ul style={{ listStyle: 'none', color: '#888' }}>
                        <li style={{ marginBottom: '10px' }}><a href="/">Home</a></li>
                        <li style={{ marginBottom: '10px' }}><a href="/dashboard">My Tickets</a></li>
                        <li style={{ marginBottom: '10px' }}><a href="/login">Login</a></li>
                    </ul>
                </div>

                <div>
                    <h4 style={{ color: '#D4AF37', marginBottom: '20px' }}>Contact</h4>
                    <p style={{ color: '#888', marginBottom: '10px' }}>Addis Ababa, Ethiopia</p>
                    <p style={{ color: '#888', marginBottom: '10px' }}>info@gastcinema.com</p>
                    <p style={{ color: '#888' }}>+251 911 000 000</p>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #222', color: '#444' }}>
                &copy; {new Date().getFullYear()} Gast Cinema. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
