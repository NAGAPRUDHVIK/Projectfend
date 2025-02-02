// AdminPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';

const AdminPage = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [showUserCard, setShowUserCard] = useState(false);
    const navigate = useNavigate();
    
    const email = localStorage.getItem('email');
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');

    // Mock data - replace with actual data from your backend
    const dashboardData = {
        employees: 1500,
        parkingSlots: 1000,
        workspaces: 1000,
        venues: 20,
        feedback: 100,
        parkingOccupied: 500,
        workspaceOccupied: 600,
        venueOccupied: 20,
        feedbackResolved: 30
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
        { icon: '📍', label: 'Venue', path: 'venue' },
        { icon: '💬', label: 'Feedback', path: 'feedback' }
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
                    <h1>Dashboard</h1>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </header>

                {/* Dashboard Content */}
                <main className="dashboard-main">
                    {/* Stats Overview */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3>No of Employees</h3>
                            <p>{dashboardData.employees}</p>
                        </div>
                        <div className="stat-card">
                            <h3>No of Parking Slots</h3>
                            <p>{dashboardData.parkingSlots}</p>
                        </div>
                        <div className="stat-card">
                            <h3>No of Workspaces</h3>
                            <p>{dashboardData.workspaces}</p>
                        </div>
                        <div className="stat-card">
                            <h3>No of Venue</h3>
                            <p>{dashboardData.venues}</p>
                        </div>
                        <div className="stat-card">
                            <h3>No of feedback</h3>
                            <p>{dashboardData.feedback}</p>
                        </div>
                    </div>

                    {/* Detailed Stats */}
                    <div className="detailed-stats">
                        <div className="detail-card">
                            <div className="percentage">50%</div>
                            <p>Occupied parking: 500</p>
                            <p>Unoccupied parking: 500</p>
                        </div>
                        <div className="detail-card">
                            <div className="percentage">60%</div>
                            <p>Occupied Workspace: 600</p>
                            <p>Unoccupied Workspace: 400</p>
                        </div>
                        <div className="detail-card">
                            <div className="percentage">75%</div>
                            <p>Occupied Venue: 20</p>
                            <p>Unoccupied Venue: 15</p>
                        </div>
                        <div className="detail-card">
                            <div className="percentage">30%</div>
                            <p>Feedback Received: 100</p>
                            <p>Feedback Resolved: 30</p>
                        </div>
                    </div>
                </main>
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
        </div>
    );
};

export default AdminPage;