import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';
import './ParkingTable.css';

const ParkingPage = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [showUserCard, setShowUserCard] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [parkingBookings, setParkingBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const itemsPerPage = 5;
    
    const [newParking, setNewParking] = useState({
        building: '',
        floor: '',
        parkingType: '',
        parkingNumber: ''
    });

    const navigate = useNavigate();
    const email = localStorage.getItem('email');
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');

    // Fetch parking bookings from API
    const fetchParkingBookings = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8060/api/parking-bookings');
            if (!response.ok) {
                throw new Error('Failed to fetch parking bookings');
            }
            const data = await response.json();
            
            // Transform the data to match table structure
            const transformedData = data.map(booking => ({
                bid: booking.parkingBookingid,
                uid: booking.userId.toString(),
                slot: booking.parkingId.toString(),
                duration: `${booking.startTime}-${booking.endTime}`,
                bookingDate: booking.parkingBookingDate
            }));
            
            setParkingBookings(transformedData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch booking details by ID
    const handleViewBooking = async (bookingId) => {
        try {
            const response = await fetch(`http://localhost:8060/api/parking-bookings/${bookingId}`);
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

    // Fetch data when component mounts
    useEffect(() => {
        fetchParkingBookings();
    }, []);

    const handleCreateParking = () => {
        console.log('Creating new parking:', newParking);
        setShowAddModal(false);
        setNewParking({
            building: '',
            floor: '',
            parkingType: '',
            parkingNumber: ''
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

    const handleSearch = () => {
        setCurrentPage(1);
    };

    const navItems = [
        { icon: '👤', label: 'Dashboard', path: '' },
        { icon: '👥', label: 'Employees', path: 'employees' },
        { icon: '🚗', label: 'Parking', path: 'parking' },
        { icon: '🏢', label: 'Workspace', path: 'workspace' },
        { icon: '📍', label: 'Venue', path: 'venue' }
    ];

    // Filter data based on search term
    const filteredData = parkingBookings.filter(item =>
        item.bid.toString().includes(searchTerm) ||
        item.uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.slot.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);

    if (loading) {
        return <div className="loading">Loading parking bookings...</div>;
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
                {/* Header */}
                <header className="dashboard-header">
                    <h1>Parking Management</h1>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </header>

                {/* Parking Table */}
                <div className="parking-table-container">
                    <div className="table-header">
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search by BID, UID, or Slot..."
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button onClick={handleSearch} className="search-button">
                                Search
                            </button>
                        </div>
                    </div>
                    
                    <table className="parking-table">
                        <thead>
                            <tr>
                                <th>BID</th>
                                <th>UID</th>
                                <th>Slot</th>
                                <th>Duration</th>
                                <th>Booking Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((item) => (
                                <tr key={item.bid}>
                                    <td>{item.bid}</td>
                                    <td>{item.uid}</td>
                                    <td>{item.slot}</td>
                                    <td>{item.duration}</td>
                                    <td>{item.bookingDate}</td>
                                    <td>
                                        <button 
                                            onClick={() => handleViewBooking(item.bid)}
                                            className="view-button"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="pagination">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Booking Details Modal */}
            {showDetailsModal && selectedBooking && (
                <div className="modal-overlay">
                    <div className="modal-content">
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
                            <p><strong>Booking ID:</strong> {selectedBooking.parkingBookingid}</p>
                            <p><strong>Booking Date:</strong> {selectedBooking.parkingBookingDate}</p>
                            <p><strong>Start Time:</strong> {selectedBooking.startTime}</p>
                            <p><strong>End Time:</strong> {selectedBooking.endTime}</p>
                            <p><strong>User Name:</strong> {selectedBooking.user.userFirstName}</p>
                            <p><strong>User Email:</strong> {selectedBooking.user.userEmail}</p>
                            <p><strong>Parking Number:</strong> {selectedBooking.parking.parkingNumber}</p>
                            <p><strong>Building:</strong> {selectedBooking.parking.parkingBuilding}</p>
                        </div>
                    </div>
                </div>
            )}

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
        </div>
    );
};

export default ParkingPage;