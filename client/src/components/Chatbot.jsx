import React, { useState, useRef, useEffect } from 'react';
import { FaCommentDots, FaPaperPlane, FaTimes } from 'react-icons/fa';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Welcome to Gast Cinema! How can I help you today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simulated Bot Response
        setTimeout(() => {
            let botText = "Thank you for contacting us. A representative will be with you shortly.";
            const lowerInput = userMsg.text.toLowerCase();

            if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
                botText = "Hello there! Ready to book a movie?";
            } else if (lowerInput.includes('book') || lowerInput.includes('ticket')) {
                botText = "You can book tickets by selecting a movie from the Home page.";
            } else if (lowerInput.includes('price') || lowerInput.includes('cost')) {
                botText = "Ticket prices vary by showtime. Check the details page for specifics!";
            } else if (lowerInput.includes('location') || lowerInput.includes('where')) {
                botText = "We are located in Addis Ababa, Ethiopia.";
            }

            setMessages(prev => [...prev, { id: Date.now() + 1, text: botText, sender: 'bot' }]);
        }, 1000);
    };

    return (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 3000, fontFamily: 'Lato, sans-serif' }}>

            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: '#D4AF37', // Gold
                        color: '#fff',
                        border: 'none',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                        fontSize: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.3s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <FaCommentDots />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    width: '320px',
                    height: '450px',
                    background: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    animation: 'slideUp 0.3s ease'
                }}>

                    {/* Header */}
                    <div style={{ background: '#000', color: '#D4AF37', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold' }}>Gast Assistant</span>
                        <button onClick={() => setIsOpen(false)} style={{ color: '#fff', fontSize: '1rem' }}><FaTimes /></button>
                    </div>

                    {/* Messages Area */}
                    <div style={{ flex: 1, padding: '15px', overflowY: 'auto', background: '#f9f9f9' }}>
                        {messages.map(msg => (
                            <div key={msg.id} style={{
                                marginBottom: '10px',
                                display: 'flex',
                                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                            }}>
                                <div style={{
                                    maxWidth: '80%',
                                    padding: '10px 14px',
                                    borderRadius: '12px',
                                    fontSize: '0.9rem',
                                    background: msg.sender === 'user' ? '#D4AF37' : '#fff',
                                    color: msg.sender === 'user' ? '#fff' : '#333',
                                    border: msg.sender === 'bot' ? '1px solid #eee' : 'none',
                                    borderBottomRightRadius: msg.sender === 'user' ? '2px' : '12px',
                                    borderBottomLeftRadius: msg.sender === 'bot' ? '2px' : '12px'
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} style={{ borderTop: '1px solid #eee', padding: '10px', display: 'flex', gap: '10px', background: '#fff' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Type a message..."
                            style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '20px', fontSize: '0.9rem', outline: 'none' }}
                        />
                        <button type="submit" style={{ color: '#D4AF37', fontSize: '1.2rem', padding: '0 10px' }}>
                            <FaPaperPlane />
                        </button>
                    </form>
                </div>
            )}

            <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default Chatbot;
