// EmployeesPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';
import './EmployeeCards.css';

const EmployeesPage = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [showUserCard, setShowUserCard] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUser, setNewUser] = useState({
        imageUrl: '',
        name: '',
        role: '',
        uid: '',
        password: ''
    });
    
    const navigate = useNavigate();
    const email = localStorage.getItem('email');
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');

    // Sample employee data
    const employeesData = [
        {
            id: 1,
            name: 'John Smith',
            uid: 'EMP001',
            role: 'Developer',
            image: 'https://randomuser.me/api/portraits/men/1.jpg'
        },
        {
            id: 2,
            name: 'Sarah Johnson',
            uid: 'EMP002',
            role: 'Designer',
            image: 'https://randomuser.me/api/portraits/women/1.jpg'
        },
        {
            id: 3,
            name: 'Michael Brown',
            uid: 'EMP003',
            role: 'Manager',
            image: 'https://randomuser.me/api/portraits/men/2.jpg'
        },
        // Add more sample employees as needed
    ];

    const generatePassword = () => {
        const length = 12;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let password = "";
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setNewUser({ ...newUser, password });
    };

    const handleCreateUser = () => {
        // Here you would typically make an API call to create the user
        console.log('Creating new user:', newUser);
        setShowAddModal(false);
        setNewUser({
            imageUrl: '',
            name: '',
            role: '',
            uid: '',
            password: ''
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
                    <h1>Employees Management</h1>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </header>

                {/* Employee Cards Grid */}
                <div className="employee-grid">
                    {employeesData.map((employee) => (
                        <div key={employee.id} className="employee-card">
                            <img 
                                src={employee.image} 
                                alt={employee.name}
                                className="employee-image"
                            />
                            <div className="employee-name">{employee.name}</div>
                            <div className="employee-uid">{employee.uid}</div>
                            <div className="employee-role">{employee.role}</div>
                        </div>
                    ))}
                </div>

                {/* Add Employee Button */}
                <button 
                    className="add-employee-button"
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

            {/* Add User Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="add-user-modal">
                        <h2 className="modal-title">Add New User</h2>
                        <div className="form-group">
                            <label>Profile Picture URL</label>
                            <input
                                type="text"
                                value={newUser.imageUrl}
                                onChange={(e) => setNewUser({ ...newUser, imageUrl: e.target.value })}
                                placeholder="Enter image URL"
                            />
                        </div>
                        <div className="form-group">
                            <label>Username</label>
                            <input
                                type="text"
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                placeholder="Enter username"
                            />
                        </div>
                        <div className="form-group">
                            <label>User Role</label>
                            <input
                                type="text"
                                value={newUser.role}
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                placeholder="Enter user role"
                            />
                        </div>
                        <div className="form-group">
                            <label>User ID</label>
                            <input
                                type="text"
                                value={newUser.uid}
                                onChange={(e) => setNewUser({ ...newUser, uid: e.target.value })}
                                placeholder="Create user ID"
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <div className="password-input-group">
                                <input
                                    type="text"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    placeholder="Enter password"
                                />
                                <button 
                                    className="generate-password"
                                    onClick={generatePassword}
                                >
                                    Generate
                                </button>
                            </div>
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
                                onClick={handleCreateUser}
                            >
                                Create User
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeesPage;