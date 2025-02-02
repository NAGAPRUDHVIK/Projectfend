import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';
import './WorkspaceTable.css';

const WorkspacePage = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [showUserCard, setShowUserCard] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [workspaceBookings, setWorkspaceBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const itemsPerPage = 5;

    const navigate = useNavigate();
    const email = localStorage.getItem('email');
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');

    // Fetch all workspace bookings
    const fetchWorkspaceBookings = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8060/api/workspace-bookings');
            if (!response.ok) {
                throw new Error('Failed to fetch workspace bookings');
            }
            const data = await response.json();
            setWorkspaceBookings(data);
        } catch (err) {
            setError(err.message);
            setWorkspaceBookings([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch single booking details
    const handleViewBooking = async (bookingId) => {
        try {
            const response = await fetch(`http://localhost:8060/api/workspace-bookings/${bookingId}`);
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
        fetchWorkspaceBookings();
    }, []);

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

    const userDetails = {
        name: "Joy Smith",
        age: 32,
        phone: "+1 234 567 8900",
        id: "AD123456",
        role: roles[0]
    };

    // Filter data based on search term
    const filteredData = workspaceBookings.filter(booking => {
        const bookingId = booking?.wbookingId?.toString() || '';
        const userId = booking?.userId?.toString() || '';
        const workspaceId = booking?.workspaceId?.toString() || '';
        const searchLower = searchTerm.toLowerCase();

        return bookingId.includes(searchTerm) ||
               userId.includes(searchTerm) ||
               workspaceId.includes(searchTerm);
    });

    // Calculate pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);

    if (loading) {
        return <div className="loading">Loading workspace bookings...</div>;
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
                    <h1>Workspace Management</h1>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </header>

                <div className="workspace-table-container">
                    <div className="table-header">
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search by Booking ID, User ID, or Workspace ID..."
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button onClick={handleSearch} className="search-button">
                                Search
                            </button>
                        </div>
                    </div>
                    
                    <table className="workspace-table">
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>User ID</th>
                                <th>Workspace ID</th>
                                <th>Duration</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((booking) => (
                                <tr key={booking.wbookingId}>
                                    <td>{booking.wbookingId}</td>
                                    <td>{booking.userId}</td>
                                    <td>{booking.workspaceId}</td>
                                    <td>{`${booking.wstartTime || 'N/A'}-${booking.wendTime || 'N/A'}`}</td>
                                    <td>{booking.workspaceBookingDate || 'N/A'}</td>
                                    <td>
                                        <button 
                                            onClick={() => handleViewBooking(booking.wbookingId)}
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
                            <p><strong>Booking ID:</strong> {selectedBooking.wbookingId}</p>
                            <p><strong>Booking Date:</strong> {selectedBooking.workspaceBookingDate}</p>
                            <p><strong>Start Time:</strong> {selectedBooking.wstartTime}</p>
                            <p><strong>End Time:</strong> {selectedBooking.wendTime}</p>
                            <p><strong>User Name:</strong> {selectedBooking.user?.userFirstName}</p>
                            <p><strong>User Email:</strong> {selectedBooking.user?.userEmail}</p>
                            <p><strong>Seat Number:</strong> {selectedBooking.workspace?.seatNumber}</p>
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

export default WorkspacePage;