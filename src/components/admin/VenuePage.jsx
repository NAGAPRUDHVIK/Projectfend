import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';
import './VenueCards.css';

const VenuePage = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [showUserCard, setShowUserCard] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [flippedCards, setFlippedCards] = useState(new Set());
    const [venueBookings, setVenueBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    
    const navigate = useNavigate();
    const email = localStorage.getItem('email');
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');

    // Fetch all venue bookings
    const fetchVenueBookings = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8060/api/venue-bookings');
            if (!response.ok) {
                throw new Error('Failed to fetch venue bookings');
            }
            const data = await response.json();
            setVenueBookings(data);
        } catch (err) {
            setError(err.message);
            setVenueBookings([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch single booking details
    const handleViewBooking = async (bookingId) => {
        try {
            const response = await fetch(`http://localhost:8060/api/venue-bookings/${bookingId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch booking details');
            }
            const detailData = await response.json();
            setSelectedBooking(detailData);
            setShowDetailsModal(true);
        } catch (err) {
            setError(err.message);
        }
    };

    // Toggle card flip
    const toggleCard = (id) => {
        setFlippedCards(prevFlipped => {
            const newFlipped = new Set(prevFlipped);
            if (newFlipped.has(id)) {
                newFlipped.delete(id);
            } else {
                newFlipped.add(id);
            }
            return newFlipped;
        });
    };

    // Fetch data when component mounts
    useEffect(() => {
        fetchVenueBookings();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/', { replace: true });
    };

    const handleNavigation = (path) => {
        navigate(`/admin/${path}`);
    };

    const userDetails = {
        name: "Joy Smith",
        age: 32,
        phone: "+1 234 567 8900",
        id: "AD123456",
        role: roles[0]
    };

    const navItems = [
        { icon: '👤', label: 'Dashboard', path: '' },
        { icon: '👥', label: 'Employees', path: 'employees' },
        { icon: '🚗', label: 'Parking', path: 'parking' },
        { icon: '🏢', label: 'Workspace', path: 'workspace' },
        { icon: '📍', label: 'Venue', path: 'venue' }
    ];

    if (loading) {
        return <div className="loading">Loading venue bookings...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <button 
                    className="sidebar-toggle"
                    onClick={() => setSidebarOpen(!isSidebarOpen)}
                >
                    {isSidebarOpen ? '◀' : '▶'}
                </button>

                {/* Profile Section */}
                <div className="profile-section">
                    <div 
                        className="profile-image"
                        onClick={() => setShowUserCard(!showUserCard)}
                    >
                        <img src="/api/placeholder/64/64" alt="User" />
                    </div>
                    {isSidebarOpen && (
                        <div className="profile-info">
                            <p className="profile-email">{email}</p>
                            <p className="profile-role">{roles[0]}</p>
                        </div>
                    )}
                </div>

                {/* Navigation Items */}
                <nav className="nav-menu">
                    {navItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleNavigation(item.path)}
                            className="nav-item"
                        >
                            <span className="nav-icon">{item.icon}</span>
                            {isSidebarOpen && <span className="nav-label">{item.label}</span>}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <header className="dashboard-header">
                    <h1>Venue Management</h1>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </header>

                {/* Venue Cards Grid */}
                <div className="venue-grid">
                    {venueBookings.map((booking) => (
                        <div 
                            key={booking.venueBookingId} 
                            className={`venue-card ${flippedCards.has(booking.venueBookingId) ? 'flipped' : ''}`}
                            onClick={() => toggleCard(booking.venueBookingId)}
                        >
                            <div className="card-inner">
                                <div className="card-front">
                                    <img 
                                        src="/api/placeholder/320/200"
                                        alt="Venue"
                                        className="venue-image"
                                    />
                                    <div className="venue-info">
                                        <div className="venue-name">Booking ID: {booking.venueBookingId}</div>
                                        <div className="booking-detail">
                                            <span>User ID: {booking.userId}</span>
                                        </div>
                                        <div className="booking-detail">
                                            <span>Venue ID: {booking.venueId}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-back">
                                    <div className="booking-info">
                                        <h3>Booking Details</h3>
                                        <div className="booking-detail">
                                            <span className="booking-label">Date:</span>
                                            <span className="booking-value">{booking.venueBookingDate || 'N/A'}</span>
                                        </div>
                                        <div className="booking-detail">
                                            <span className="booking-label">Start Time:</span>
                                            <span className="booking-value">{booking.startTime}</span>
                                        </div>
                                        <div className="booking-detail">
                                            <span className="booking-label">End Time:</span>
                                            <span className="booking-value">{booking.endTime}</span>
                                        </div>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewBooking(booking.venueBookingId);
                                            }}
                                            className="view-button"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Booking Details Modal */}
            {showDetailsModal && selectedBooking && (
                <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Booking Details</h2>
                            <button 
                                onClick={() => setShowDetailsModal(false)}
                                className="close-button"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            <p><strong>Booking ID:</strong> {selectedBooking.venueBookingId}</p>
                            <p><strong>Booking Date:</strong> {selectedBooking.venueBookingDate}</p>
                            <p><strong>Start Time:</strong> {selectedBooking.startTime}</p>
                            <p><strong>End Time:</strong> {selectedBooking.endTime}</p>
                            <p><strong>User Name:</strong> {selectedBooking.user?.userFirstName}</p>
                            <p><strong>User Email:</strong> {selectedBooking.user?.userEmail}</p>
                            <p><strong>Venue Name:</strong> {selectedBooking.venue?.venueName}</p>
                            <p><strong>Building:</strong> {selectedBooking.venue?.venueBuilding}</p>
                            <p><strong>Floor:</strong> {selectedBooking.venue?.venueFloor}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* User Details Modal */}
            {showUserCard && (
                <div className="modal-overlay" onClick={() => setShowUserCard(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>User Details</h2>
                            <button 
                                onClick={() => setShowUserCard(false)}
                                className="close-button"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            <p><strong>Name:</strong> {userDetails.name}</p>
                            <p><strong>Age:</strong> {userDetails.age}</p>
                            <p><strong>Phone:</strong> {userDetails.phone}</p>
                            <p><strong>ID:</strong> {userDetails.id}</p>
                            <p><strong>Role:</strong> {userDetails.role}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VenuePage;