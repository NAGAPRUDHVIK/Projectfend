// EmployeesPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminPage.css';
import './EmployeeCards.css';

const EmployeesPage = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [showUserCard, setShowUserCard] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [availableRoles, setAvailableRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newUser, setNewUser] = useState({
        userEmail: '',
        userPassword: '',
        userFirstName: '',
        userLastName: '',
        userPhoneNo: '',
        allRolesId: []
    });
    
    const navigate = useNavigate();
    const email = localStorage.getItem('email');
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');

    const fetchAvailableRoles = async () => {
        try {
            const response = await axios.get('http://localhost:8060/api/user-roles');
            setAvailableRoles(response.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
            setError('Failed to fetch roles');
        }
    };

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const usersResponse = await axios.get('http://localhost:8060/api/users');
            const users = usersResponse.data;

            const employeesWithRoles = await Promise.all(
                users.map(async (user) => {
                    try {
                        const rolesResponse = await axios.get(`http://localhost:8060/api/user-roles/${user.userId}`);
                        return {
                            ...user,
                            roles: rolesResponse.data
                        };
                    } catch (error) {
                        console.error(`Error fetching roles for user ${user.userId}:`, error);
                        return {
                            ...user,
                            roles: []
                        };
                    }
                })
            );

            setEmployees(employeesWithRoles);
            setError(null);
        } catch (err) {
            setError('Failed to fetch employees data');
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
        fetchAvailableRoles();
    }, []);

    const generatePassword = () => {
        const length = 12;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let password = "";
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setNewUser({ ...newUser, userPassword: password });
    };

    const handleCreateUser = async () => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:8060/api/users/register', newUser);
            console.log('User created successfully:', response.data);
            
            await fetchEmployees();
            
            setShowAddModal(false);
            setNewUser({
                userEmail: '',
                userPassword: '',
                userFirstName: '',
                userLastName: '',
                userPhoneNo: '',
                allRolesId: []
            });
            
            setError(null);
        } catch (err) {
            setError('Failed to create user');
            console.error('Error creating user:', err);
        } finally {
            setLoading(false);
        }
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

            <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
                <header className="dashboard-header">
                    <h1>Employees Management</h1>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </header>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="loading-message">
                        Loading...
                    </div>
                )}

                <div className="employee-grid">
                    {employees.map((employee) => (
                        <div key={employee.userId} className="employee-card">
                            <img 
                                src="/api/placeholder/150/150"
                                alt={employee.userFirstName}
                                className="employee-image"
                            />
                            <div className="employee-name">
                                {employee.userFirstName} {employee.userLastName}
                            </div>
                            <div className="employee-uid">ID: {employee.userId}</div>
                            <div className="employee-email">{employee.userEmail}</div>
                            <div className="employee-roles">
                                {employee.roles.map((role, index) => (
                                    <span key={index} className="role-badge">
                                        {role}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <button 
                    className="add-employee-button"
                    onClick={() => setShowAddModal(true)}
                >
                    +
                </button>
            </div>

            {showAddModal && (
                <div className="modal-overlay">
                    <div className="add-user-modal">
                        <h2 className="modal-title">Add New User</h2>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={newUser.userEmail}
                                onChange={(e) => setNewUser({ ...newUser, userEmail: e.target.value })}
                                placeholder="Enter email"
                            />
                        </div>
                        <div className="form-group">
                            <label>First Name</label>
                            <input
                                type="text"
                                value={newUser.userFirstName}
                                onChange={(e) => setNewUser({ ...newUser, userFirstName: e.target.value })}
                                placeholder="Enter first name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input
                                type="text"
                                value={newUser.userLastName}
                                onChange={(e) => setNewUser({ ...newUser, userLastName: e.target.value })}
                                placeholder="Enter last name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                value={newUser.userPhoneNo}
                                onChange={(e) => setNewUser({ ...newUser, userPhoneNo: e.target.value })}
                                placeholder="Enter phone number"
                            />
                        </div>
                        <div className="form-group">
                            <label>Role</label>
                            <select
                                multiple
                                value={newUser.allRolesId}
                                onChange={(e) => {
                                    const selectedRoles = Array.from(
                                        e.target.selectedOptions, 
                                        option => parseInt(option.value)
                                    );
                                    setNewUser({ ...newUser, allRolesId: selectedRoles });
                                }}
                                className="role-select"
                            >
                                {availableRoles.map((role) => (
                                    <option key={role.roleId} value={role.roleId}>
                                        {role.roleName}
                                    </option>
                                ))}
                            </select>
                            <small className="help-text">Hold Ctrl/Cmd to select multiple roles</small>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <div className="password-input-group">
                                <input
                                    type="text"
                                    value={newUser.userPassword}
                                    onChange={(e) => setNewUser({ ...newUser, userPassword: e.target.value })}
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
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create User'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeesPage;