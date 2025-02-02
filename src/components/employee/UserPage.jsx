import React, { useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import ParkingComponent from './ParkingComponent';
import WorkspaceComponent from './WorkspaceComponent';
import VenueComponent from './VenueComponent';

const UserPage = () => {
    const [showUserCard, setShowUserCard] = useState(false);
    const navigate = useNavigate();
    
    const email = localStorage.getItem('email');
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');

    // Mock data for dashboard
    const dashboardData = {
        availableParking: 500,
        availableWorkspaces: 400,
        availableVenues: 15,
        myBookings: {
            parking: 1,
            workspace: 1,
            venue: 0
        }
    };

    const userDetails = {
        name: "John Doe",
        email: email,
        id: "USR123456",
        role: roles[0],
        department: "Engineering",
        phone: "+1 234 567 8900"
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/', { replace: true });
    };

    const handleNavigation = (path) => {
        navigate(`/user/${path}`);
    };

    const navItems = [
        { icon: '👤', label: 'Dashboard', path: '' },
        { icon: '🚗', label: 'Parking', path: 'parking' },
        { icon: '🏢', label: 'Workspace', path: 'workspace' },
        { icon: '📍', label: 'Venue', path: 'venue' }
    ];

    const DashboardContent = () => (
        <main className="dashboard-main">
            {/* Stats Overview */}
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Available Parking</h3>
                    <p>{dashboardData.availableParking}</p>
                </div>
                <div className="stat-card">
                    <h3>Available Workspace</h3>
                    <p>{dashboardData.availableWorkspaces}</p>
                </div>
                <div className="stat-card">
                    <h3>Available Venues</h3>
                    <p>{dashboardData.availableVenues}</p>
                </div>
            </div>

            {/* User Bookings Stats */}
            <div className="detailed-stats">
                <div className="detail-card">
                    <h3 className="text-xl font-semibold mb-4">My Current Bookings</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <p>Parking Space</p>
                            <span className="badge">{dashboardData.myBookings.parking}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <p>Workspace</p>
                            <span className="badge">{dashboardData.myBookings.workspace}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <p>Venue</p>
                            <span className="badge">{dashboardData.myBookings.venue}</span>
                        </div>
                    </div>
                </div>
                <div className="detail-card">
                    <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-4">
                        <button 
                            onClick={() => handleNavigation('parking')}
                            className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Book Parking
                        </button>
                        <button 
                            onClick={() => handleNavigation('workspace')}
                            className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Reserve Workspace
                        </button>
                        <button 
                            onClick={() => handleNavigation('venue')}
                            className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Request Venue
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );

    return (
        <div className="dashboard-container">
            {/* Fixed Sidebar */}
            <div className="sidebar open">
                {/* Profile Section */}
                <div className="profile-section">
                    <div 
                        className="profile-image"
                        onClick={() => setShowUserCard(!showUserCard)}
                    >
                        <img src="/api/placeholder/64/64" alt="User" />
                    </div>
                    <div className="profile-info">
                        <p className="profile-email">{email}</p>
                        <p className="profile-role">{roles[0]}</p>
                    </div>
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
                            <span className="nav-label">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="main-content sidebar-open">
                {/* Header */}
                <header className="dashboard-header">
                    <h1>User Dashboard</h1>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </header>

                {/* Routes */}
                <Routes>
                    <Route path="/" element={<DashboardContent />} />
                    <Route path="/parking" element={<ParkingComponent />} />
                    <Route path="/workspace" element={<WorkspaceComponent />} />
                    <Route path="/venue" element={<VenueComponent />} />
                </Routes>
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
                            <p><strong>Email:</strong> {userDetails.email}</p>
                            <p><strong>ID:</strong> {userDetails.id}</p>
                            <p><strong>Role:</strong> {userDetails.role}</p>
                            <p><strong>Department:</strong> {userDetails.department}</p>
                            <p><strong>Phone:</strong> {userDetails.phone}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserPage;