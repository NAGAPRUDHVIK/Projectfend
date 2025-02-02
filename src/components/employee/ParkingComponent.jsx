import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ParkingStyles.css';

const ParkingBookingComponent = () => {
    const [buildings, setBuildings] = useState([]);
    const [floors, setFloors] = useState([]);
    const [parkingSlots, setParkingSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        building: '',
        floor: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        parkingType: ''
    });

    // Add stats state
    const [stats, setStats] = useState({
        totalSlots: 0,
        availableSlots: 0,
        bookedSlots: 0
    });

    useEffect(() => {
        fetchBuildings();
    }, []);

    const fetchBuildings = async () => {
        try {
            const response = await axios.get('http://localhost:8060/api/parkings');
            const uniqueBuildings = [...new Set(response.data.map(p => p.parkingBuilding))];
            setBuildings(uniqueBuildings);
        } catch (error) {
            setError('Failed to fetch buildings');
        }
    };

    const handleBuildingChange = async (building) => {
        setFormData({ ...formData, building, floor: '' }); // Reset floor when building changes
        if (!building) return;
        
        try {
            const response = await axios.get('http://localhost:8060/api/parkings');
            const buildingFloors = [...new Set(
                response.data
                    .filter(p => p.parkingBuilding === building)
                    .map(p => p.parkingFloor)
            )];
            setFloors(buildingFloors);
        } catch (error) {
            setError('Failed to fetch floors');
        }
    };

    const handleFormSubmit = async () => {
        if (!formData.building || !formData.floor || !formData.parkingType || !formData.date || !formData.startTime || !formData.endTime) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            // Fetch current bookings for the selected date
            const bookingsResponse = await axios.get('http://localhost:8060/api/parking-bookings');
            const currentBookings = bookingsResponse.data.filter(booking => 
                booking.parkingBookingDate === formData.date
            );

            // Fetch parking slots
            const parkingsResponse = await axios.get('http://localhost:8060/api/parkings');
            const filteredParkings = parkingsResponse.data.filter(slot => 
                slot.parkingBuilding === formData.building &&
                slot.parkingFloor === formData.floor &&
                slot.parkingType === formData.parkingType
            );

            // Process availability
            const processedSlots = filteredParkings.map(slot => {
                const slotBookings = currentBookings.filter(booking => 
                    booking.parkingId === slot.parkingId
                );

                const isTimeConflict = slotBookings.some(booking => {
                    const bookingStart = booking.startTime;
                    const bookingEnd = booking.endTime;
                    return !(formData.endTime <= bookingStart || formData.startTime >= bookingEnd);
                });

                return {
                    ...slot,
                    isAvailable: slot.parkingAvailable && !isTimeConflict
                };
            });

            setParkingSlots(processedSlots);

            // Update stats
            setStats({
                totalSlots: processedSlots.length,
                availableSlots: processedSlots.filter(slot => slot.isAvailable).length,
                bookedSlots: processedSlots.filter(slot => !slot.isAvailable).length
            });

            setError('');
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to fetch parking data');
        } finally {
            setLoading(false);
        }
    };

    const handleSlotClick = (slot) => {
        if (!slot.isAvailable) {
            const element = document.getElementById(`slot-${slot.parkingId}`);
            element?.classList.add('vibrate');
            setTimeout(() => element?.classList.remove('vibrate'), 500);
            setError('This slot is not available for booking');
            return;
        }
        setSelectedSlot(slot);
        setError('');
    };

    const handleBooking = async () => {
        if (!selectedSlot) return;

        try {
            const bookingData = {
                userId: 3, // Replace with actual logged in user ID
                parkingId: selectedSlot.parkingId,
                parkingBookingDate: formData.date,
                startTime: formData.startTime,
                endTime: formData.endTime
            };

            await axios.post('http://localhost:8060/api/parking-bookings', bookingData);
            
            // Update the slot's availability in the local state
            setParkingSlots(prevSlots => 
                prevSlots.map(slot => 
                    slot.parkingId === selectedSlot.parkingId 
                        ? { ...slot, isAvailable: false }
                        : slot
                )
            );

            setError('Booking successful!');
            setSelectedSlot(null);
            
            // Update stats
            setStats(prev => ({
                ...prev,
                availableSlots: prev.availableSlots - 1,
                bookedSlots: prev.bookedSlots + 1
            }));
        } catch (error) {
            setError('Failed to book parking slot');
        }
    };

    const renderParkingGrid = () => {
        if (!parkingSlots.length) {
            return (
                <div className="no-slots-message">
                    Please search for available parking slots using the form above.
                </div>
            );
        }

        const slots = parkingSlots.map(slot => (
            <div
                key={slot.parkingId}
                id={`slot-${slot.parkingId}`}
                className={`parking-slot ${
                    slot.isAvailable ? 'available' : 'booked'
                } ${selectedSlot?.parkingId === slot.parkingId ? 'selected' : ''}`}
                onClick={() => handleSlotClick(slot)}
            >
                <div className="slot-content">
                    <div className="slot-number">{slot.parkingNumber}</div>
                    <div className="slot-type">{slot.parkingType}</div>
                </div>
            </div>
        ));

        return (
            <div className="parking-slots-grid">
                {slots}
            </div>
        );
    };

    return (
        <div className="parking-layout-container">
            <div className="booking-header">
                <h1>Parking Slot Booking</h1>
                {error && (
                    <div className={`alert ${error.includes('successful') ? 'alert-success' : 'alert-error'}`}>
                        {error}
                    </div>
                )}
            </div>

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

                    <select 
                        value={formData.parkingType}
                        onChange={(e) => setFormData({ ...formData, parkingType: e.target.value })}
                    >
                        <option value="">Select Vehicle Type</option>
                        <option value="2-wheeler">Two Wheeler</option>
                        <option value="4-wheeler">Four Wheeler</option>
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
                </div>

                <button 
                    className={`search-button ${loading ? 'loading' : ''}`} 
                    onClick={handleFormSubmit}
                    disabled={loading}
                >
                    {loading ? 'Searching...' : 'Search Available Slots'}
                </button>
            </div>

            {parkingSlots.length > 0 && (
                <div className="stats-container">
                    <div className="stat-item">
                        <span className="stat-label">Total Slots:</span>
                        <span className="stat-value">{stats.totalSlots}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Available:</span>
                        <span className="stat-value text-green-600">{stats.availableSlots}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Booked:</span>
                        <span className="stat-value text-red-600">{stats.bookedSlots}</span>
                    </div>
                </div>
            )}

            <div className="parking-legend">
                <div className="legend-item">
                    <span className="legend-box available"></span>
                    <span>Available</span>
                </div>
                <div className="legend-item">
                    <span className="legend-box booked"></span>
                    <span>Booked</span>
                </div>
                <div className="legend-item">
                    <span className="legend-box selected"></span>
                    <span>Selected</span>
                </div>
            </div>

            <div className="parking-grid">
                {renderParkingGrid()}
            </div>

            {selectedSlot && (
                <div className="booking-footer">
                    <div className="selected-slot-info">
                        <p>Selected: {selectedSlot.parkingNumber}</p>
                        <p>Type: {selectedSlot.parkingType}</p>
                        <p>Building: {selectedSlot.parkingBuilding}</p>
                        <p>Floor: {selectedSlot.parkingFloor}</p>
                    </div>
                    <button className="confirm-button" onClick={handleBooking}>
                        Confirm Booking
                    </button>
                </div>
            )}
        </div>
    );
};

export default ParkingBookingComponent;