// WorkspacePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';
import './WorkspaceTable.css';

const WorkspacePage = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [showUserCard, setShowUserCard] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    
    const [newWorkspace, setNewWorkspace] = useState({
        monitor: '',
        whiteboard: '',
        building: '',
        floor: '',
        workstationNumber: ''
    });

    const navigate = useNavigate();
    const email = localStorage.getItem('email');
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');

    // Sample workspace data
    const workspaceData = [
        { bid: 1, name: 'Ram Kumar', uid: '29038', workstation: 'AS-01', duration: '09:00-17:00' },
        { bid: 2, name: 'Sarah Johnson', uid: '29039', workstation: 'AS-02', duration: '10:00-18:00' },
        { bid: 3, name: 'Alex Chen', uid: '29040', workstation: 'AS-03', duration: '08:00-16:00' },
        { bid: 4, name: 'Maria Garcia', uid: '29041', workstation: 'AS-04', duration: '09:30-17:30' },
        { bid: 5, name: 'John Smith', uid: '29042', workstation: 'AS-05', duration: '08:30-16:30' },
        { bid: 6, name: 'Emma Wilson', uid: '29043', workstation: 'AS-06', duration: '10:30-18:30' },
        { bid: 7, name: 'David Lee', uid: '29044', workstation: 'AS-07', duration: '07:00-15:00' },
        { bid: 8, name: 'Lisa Brown', uid: '29045', workstation: 'AS-08', duration: '11:00-19:00' },
        { bid: 9, name: 'James Taylor', uid: '29046', workstation: 'AS-09', duration: '09:00-17:00' },
        { bid: 10, name: 'Anna Kim', uid: '29047', workstation: 'AS-10', duration: '08:00-16:00' }
    ];

    const handleCreateWorkspace = () => {
        // Here you would typically make an API call to create the workspace
        console.log('Creating new workspace:', newWorkspace);
        setShowAddModal(false);
        setNewWorkspace({
            monitor: '',
            whiteboard: '',
            building: '',
            floor: '',
            workstationNumber: ''
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
    const filteredData = workspaceData.filter(item =>
        item.bid.toString().includes(searchTerm) ||
        item.uid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.workstation.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate pagination
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);

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
                    <h1>Workspace Management</h1>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </header>

                {/* Workspace Table */}
                <div className="workspace-table-container">
                    <div className="table-header">
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search by BID, UID, or Workstation..."
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
                                <th>BID</th>
                                <th>Name</th>
                                <th>UID</th>
                                <th>Workstation</th>
                                <th>Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((item) => (
                                <tr key={item.bid}>
                                    <td>{item.bid}</td>
                                    <td>{item.name}</td>
                                    <td>{item.uid}</td>
                                    <td>{item.workstation}</td>
                                    <td>{item.duration}</td>
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

                {/* Add Workspace Button */}
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

            {/* Add Workspace Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="add-modal">
                        <h2 className="modal-title">Add New Workspace</h2>
                        <div className="form-group">
                            <label>Has Monitor?</label>
                            <select
                                value={newWorkspace.monitor}
                                onChange={(e) => setNewWorkspace({ ...newWorkspace, monitor: e.target.value })}
                            >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Has Whiteboard?</label>
                            <select
                                value={newWorkspace.whiteboard}
                                onChange={(e) => setNewWorkspace({ ...newWorkspace, whiteboard: e.target.value })}
                            >
                                <option value="">Select</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Building</label>
                            <select
                                value={newWorkspace.building}
                                onChange={(e) => setNewWorkspace({ ...newWorkspace, building: e.target.value })}
                            >
                                <option value="">Select</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Floor</label>
                            <select
                                value={newWorkspace.floor}
                                onChange={(e) => setNewWorkspace({ ...newWorkspace, floor: e.target.value })}
                            >
                                <option value="">Select</option>
                                <option value="Ground">Ground</option>
                                <option value="Floor1">Floor 1</option>
                                <option value="Floor2">Floor 2</option>
                                <option value="Floor3">Floor 3</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Workstation Number</label>
                            <input
                                type="text"
                                value={newWorkspace.workstationNumber}
                                onChange={(e) => setNewWorkspace({ ...newWorkspace, workstationNumber: e.target.value })}
                                placeholder="Enter workstation number"
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
                                onClick={handleCreateWorkspace}
                            >
                                Create Workspace
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkspacePage;