import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WorkspaceStyles.css';

const WorkspaceBookingComponent = () => {
    const [buildings, setBuildings] = useState([]);
    const [floors, setFloors] = useState([]);
    const [workspaces, setWorkspaces] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [selectedWorkspace, setSelectedWorkspace] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        totalWorkspaces: 0,
        availableWorkspaces: 0,
        bookedWorkspaces: 0
    });

    const [formData, setFormData] = useState({
        building: '',
        floor: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        hasMonitor: false,
        hasWhiteboard: false
    });

    useEffect(() => {
        fetchWorkspaces();
        fetchBookings();
    }, []);

    const fetchWorkspaces = async () => {
        try {
            const response = await axios.get('http://localhost:8060/api/workspaces');
            const data = response.data;
            const uniqueBuildings = [...new Set(data.map(w => w.workspaceBuilding))];
            setBuildings(uniqueBuildings);

            // Update stats
            setStats({
                totalWorkspaces: data.length,
                availableWorkspaces: data.filter(w => w.workspaceAvailable).length,
                bookedWorkspaces: data.filter(w => !w.workspaceAvailable).length
            });
        } catch (error) {
            setError('Failed to fetch workspaces');
        }
    };

    const handleBuildingChange = async (building) => {
        setFormData({ ...formData, building, floor: '' });
        if (!building) return;
        
        try {
            const response = await axios.get('http://localhost:8060/api/workspaces');
            const buildingFloors = [...new Set(
                response.data
                    .filter(w => w.workspaceBuilding === building)
                    .map(w => w.workspaceFloor)
            )];
            setFloors(buildingFloors);
        } catch (error) {
            setError('Failed to fetch floors');
        }
    };

    const fetchBookings = async () => {
        try {
            const response = await axios.get('http://localhost:8060/api/workspace-bookings');
            setBookings(response.data);
        } catch (error) {
            setError('Failed to fetch bookings');
        }
    };

    const handleFormSubmit = async () => {
        if (!formData.building || !formData.floor || !formData.date || !formData.startTime || !formData.endTime) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            // Fetch current bookings
            const bookingsResponse = await axios.get('http://localhost:8060/api/workspace-bookings');
            const currentBookings = bookingsResponse.data;

            // Fetch workspaces
            const workspacesResponse = await axios.get('http://localhost:8060/api/workspaces');
            const availableWorkspaces = workspacesResponse.data.filter(workspace => 
                workspace.workspaceBuilding === formData.building &&
                workspace.workspaceFloor === formData.floor &&
                (!formData.hasMonitor || workspace.hasMonitor) &&
                (!formData.hasWhiteboard || workspace.hasWhiteboard)
            );

            // Check availability
            const processedWorkspaces = availableWorkspaces.map(workspace => {
                const isBooked = currentBookings.some(booking => 
                    booking.workspaceId === workspace.workspaceId &&
                    booking.workspaceBookingDate === formData.date &&
                    !(booking.wendTime <= formData.startTime || booking.wstartTime >= formData.endTime)
                );
                return {
                    ...workspace,
                    isAvailable: !isBooked && workspace.workspaceAvailable
                };
            });

            setWorkspaces(processedWorkspaces);
            setError('');
        } catch (error) {
            setError('Failed to fetch workspace data');
        } finally {
            setLoading(false);
        }
    };

    const handleWorkspaceClick = (workspace) => {
        if (!workspace.isAvailable) {
            const element = document.getElementById(`workspace-${workspace.workspaceId}`);
            element?.classList.add('vibrate');
            setTimeout(() => element?.classList.remove('vibrate'), 500);
            setError('This workspace is not available');
            return;
        }
        setSelectedWorkspace(workspace);
        setError('');
    };

    const handleBooking = async () => {
        if (!selectedWorkspace) return;

        try {
            const bookingData = {
                userId: 1, // Replace with actual logged in user ID
                workspaceId: selectedWorkspace.workspaceId,
                workspaceBookingDate: formData.date,
                wstartTime: formData.startTime,
                wendTime: formData.endTime
            };

            await axios.post('http://localhost:8060/api/workspace-bookings', bookingData);
            setError('Booking successful!');
            handleFormSubmit();
            setSelectedWorkspace(null);
        } catch (error) {
            setError('Failed to book workspace');
        }
    };

    return (
        <div className="workspace-layout-container">
            <div className="booking-header">
                <h1>Workspace Booking System</h1>
                {error && (
                    <div className={`alert ${error.includes('successful') ? 'alert-success' : 'alert-error'}`}>
                        {error}
                    </div>
                )}
            </div>

            {/* Statistics Display */}
            <div className="stats-container">
                <div className="stat-item">
                    <span className="stat-label">Total Workspaces</span>
                    <span className="stat-value">{stats.totalWorkspaces}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Available</span>
                    <span className="stat-value text-green-600">{stats.availableWorkspaces}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Booked</span>
                    <span className="stat-value text-red-600">{stats.bookedWorkspaces}</span>
                </div>
            </div>

            {/* Booking Form */}
            <div className="booking-form">
                <div className="form-grid">
                    <select 
                        value={formData.building}
                        onChange={(e) => handleBuildingChange(e.target.value)}
                    >
                        <option value="">Select Building</option>
                        {buildings.map(building => (
                            <option key={building} value={building}>{building}</option>
                        ))}
                    </select>

                    <select 
                        value={formData.floor}
                        onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    >
                        <option value="">Select Floor</option>
                        {floors.map(floor => (
                            <option key={floor} value={floor}>Floor {floor}</option>
                        ))}
                    </select>

                    <input
                        type="date"
                        value={formData.date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />

                    <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    />

                    <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    />

                    <div className="checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.hasMonitor}
                                onChange={(e) => setFormData({ ...formData, hasMonitor: e.target.checked })}
                            />
                            Monitor Required
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.hasWhiteboard}
                                onChange={(e) => setFormData({ ...formData, hasWhiteboard: e.target.checked })}
                            />
                            Whiteboard Required
                        </label>
                    </div>
                </div>

                <button 
                    className={`search-button ${loading ? 'loading' : ''}`}
                    onClick={handleFormSubmit}
                    disabled={loading}
                >
                    {loading ? 'Searching...' : 'Search Available Workspaces'}
                </button>
            </div>

            {/* Workspace Grid */}
            <div className="workspace-grid">
                {workspaces.map(workspace => (
                    <div
                        key={workspace.workspaceId}
                        id={`workspace-${workspace.workspaceId}`}
                        className={`workspace-card ${
                            workspace.isAvailable ? 'available' : 'booked'
                        } ${selectedWorkspace?.workspaceId === workspace.workspaceId ? 'selected' : ''}`}
                        onClick={() => handleWorkspaceClick(workspace)}
                    >
                        <div className="workspace-content">
                            <div className="workspace-number">{workspace.seatNumber}</div>
                            <div className="workspace-features">
                                {workspace.hasMonitor && <span>🖥️ Monitor</span>}
                                {workspace.hasWhiteboard && <span>📋 Whiteboard</span>}
                            </div>
                            <div className="workspace-status">
                                {workspace.isAvailable ? 'Available' : 'Booked'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Booking Footer */}
            {selectedWorkspace && (
                <div className="booking-footer">
                    <div className="selected-workspace-info">
                        <p>Selected: {selectedWorkspace.seatNumber}</p>
                        <p>Building: {selectedWorkspace.workspaceBuilding}</p>
                        <p>Floor: {selectedWorkspace.workspaceFloor}</p>
                        {selectedWorkspace.hasMonitor && <p>Has Monitor: Yes</p>}
                        {selectedWorkspace.hasWhiteboard && <p>Has Whiteboard: Yes</p>}
                    </div>
                    <button className="confirm-button" onClick={handleBooking}>
                        Confirm Booking
                    </button>
                </div>
            )}
        </div>
    );
};

export default WorkspaceBookingComponent;