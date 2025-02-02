// VenuePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';
import './VenueCards.css';

const VenuePage = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [showUserCard, setShowUserCard] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [flippedCards, setFlippedCards] = useState(new Set());
    
    const [newVenue, setNewVenue] = useState({
        photo: '',
        name: '',
        capacity: '',
        venueId: ''
    });
    
    const navigate = useNavigate();
    const email = localStorage.getItem('email');
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');

    // Sample venue data
    const venueData = [
        {
            id: 1,
            name: 'Conference Room A',
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
            status: 'occupied',
            booking: {
                name: 'John Smith',
                uid: '29038',
                bookingId: 'BK001',
                duration: '09:00-11:00'
            }
        },
        {
            id: 2,
            name: 'Auditorium',
            image: 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34',
            status: 'available',
            booking: null
        },
        {
            id: 3,
            name: 'Founders Hall',
            image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205',
            status: 'occupied',
            booking: {
                name: 'Sarah Johnson',
                uid: '29039',
                bookingId: 'BK002',
                duration: '13:00-15:00'
            }
        },
        {
            id: 4,
            name: 'Meeting Room 101',
            image: 'https://images.unsplash.com/photo-1497366858526-0766cadbe8fa',
            status: 'occupied',
            booking: {
                name: 'David Lee',
                uid: '29040',
                bookingId: 'BK003',
                duration: '10:00-12:00'
            }
        },
        {
            id: 5,
            name: 'Training Room',
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
            status: 'available',
            booking: null
        },
        {
            id: 6,
            name: 'Executive Suite',
            image: 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34',
            status: 'occupied',
            booking: {
                name: 'Emma Wilson',
                uid: '29041',
                bookingId: 'BK004',
                duration: '14:00-16:00'
            }
        },
        {
            id: 7,
            name: 'Innovation Lab',
            image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205',
            status: 'available',
            booking: null
        },
        {
            id: 8,
            name: 'Board Room',
            image: 'https://images.unsplash.com/photo-1497366858526-0766cadbe8fa',
            status: 'occupied',
            booking: {
                name: 'Michael Brown',
                uid: '29042',
                bookingId: 'BK005',
                duration: '11:00-13:00'
            }
        }
    ];

    const handleCreateVenue = () => {
        // Here you would typically make an API call to create the venue
        console.log('Creating new venue:', newVenue);
        setShowAddModal(false);
        setNewVenue({
            photo: '',
            name: '',
            capacity: '',
            venueId: ''
        });
    };

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

    const userDetails = {
        name: "Joy Smith",
        age: 32,
        phone: "+1 234 567 8900",
        id: "AD123456",
        role: roles[0]
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/', { replace: true });
    };

    const handleNavigation = (path) => {
        navigate(`/admin/${path}`);
    };

    const navItems = [
        { icon: '👤', label: 'Dashboard', path: '' },
        { icon: '👥', label: 'Employees', path: 'employees' },
        { icon: '🚗', label: 'Parking', path: 'parking' },
        { icon: '🏢', label: 'Workspace', path: 'workspace' },
        { icon: '📍', label: 'Venue', path: 'venue' }
    ];

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
                {/* Header */}
                <header className="dashboard-header">
                    <h1>Venue Management</h1>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </header>

                {/* Venue Cards Grid */}
                <div className="venue-grid">
                    {venueData.map((venue) => (
                        <div 
                            key={venue.id} 
                            className={`venue-card ${flippedCards.has(venue.id) ? 'flipped' : ''}`}
                            onClick={() => toggleCard(venue.id)}
                        >
                            <div className="card-inner">
                                <div className="card-front">
                                    <img 
                                        src={venue.image} 
                                        alt={venue.name}
                                        className="venue-image"
                                    />
                                    <div className="venue-info">
                                        <div className="venue-name">{venue.name}</div>
                                        <span className={`venue-status status-${venue.status}`}>
                                            {venue.status.charAt(0).toUpperCase() + venue.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                                <div className="card-back">
                                    {venue.booking ? (
                                        <div className="booking-info">
                                            <h3>Booking Details</h3>
                                            <div className="booking-detail">
                                                <span className="booking-label">Name:</span>
                                                <span className="booking-value">{venue.booking.name}</span>
                                            </div>
                                            <div className="booking-detail">
                                                <span className="booking-label">UID:</span>
                                                <span className="booking-value">{venue.booking.uid}</span>
                                            </div>
                                            <div className="booking-detail">
                                                
                                                <span className="booking-label">Booking ID:</span>
                                                <span className="booking-value">{venue.booking.bookingId}</span>
                                            </div>
                                            <div className="booking-detail">
                                                <span className="booking-label">Duration:</span>
                                                <span className="booking-value">{venue.booking.duration}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="no-booking">
                                            No current booking
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Venue Button */}
                <button 
                    className="add-button"
                    onClick={() => setShowAddModal(true)}
                >
                    +
                </button>
            </div>

            {/* User Details Modal */}
            {showUserCard && (
                <div className="modal-overlay">
                    <div className="modal-content">
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

            {/* Add Venue Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="add-modal">
                        <h2 className="modal-title">Add New Venue</h2>
                        <div className="form-group">
                            <label>Photo URL</label>
                            <input
                                type="text"
                                value={newVenue.photo}
                                onChange={(e) => setNewVenue({ ...newVenue, photo: e.target.value })}
                                placeholder="Enter photo URL"
                            />
                        </div>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                value={newVenue.name}
                                onChange={(e) => setNewVenue({ ...newVenue, name: e.target.value })}
                                placeholder="Enter venue name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Capacity</label>
                            <input
                                type="number"
                                value={newVenue.capacity}
                                onChange={(e) => setNewVenue({ ...newVenue, capacity: e.target.value })}
                                placeholder="Enter capacity"
                            />
                        </div>
                        <div className="form-group">
                            <label>Venue ID</label>
                            <input
                                type="text"
                                value={newVenue.venueId}
                                onChange={(e) => setNewVenue({ ...newVenue, venueId: e.target.value })}
                                placeholder="Enter venue ID"
                            />
                        </div>
                        <div className="modal-buttons">
                            <button 
                                className="cancel-button"
                                onClick={() => setShowAddModal(false)}
                            >
                                Cancel
                            </button>
                            <button 
                                className="create-button"
                                onClick={handleCreateVenue}
                            >
                                Create Venue
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VenuePage;