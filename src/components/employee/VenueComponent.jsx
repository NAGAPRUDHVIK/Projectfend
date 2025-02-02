import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VenueStyles.css';

const VenueBookingComponent = () => {
    const [venues, setVenues] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showVenues, setShowVenues] = useState(false);
    const [stats, setStats] = useState({
        totalVenues: 0,
        availableVenues: 0,
        bookedVenues: 0
    });

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        attendees: '',
        purpose: '',
        hasAc: false,
        hasProjector: false
    });

    useEffect(() => {
        // Initial data load
        fetchInitialData();

        // Set up polling for updates every 30 seconds
        const interval = setInterval(fetchInitialData, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchInitialData = async () => {
        try {
            const [venuesResponse, bookingsResponse] = await Promise.all([
                axios.get('http://localhost:8060/api/venues'),
                axios.get('http://localhost:8060/api/venue-bookings')
            ]);

            const currentBookings = bookingsResponse.data;
            const allVenues = venuesResponse.data;

            // Update venue availability based on current bookings
            const updatedVenues = allVenues.map(venue => {
                const isBooked = currentBookings.some(booking => 
                    booking.venueId === venue.venueId &&
                    booking.venueBookingDate === formData.date &&
                    isTimeOverlapping(booking.startTime, booking.endTime, formData.startTime, formData.endTime)
                );
                return { ...venue, isBooked };
            });

            setVenues(updatedVenues);
            setBookings(currentBookings);

            const availableCount = updatedVenues.filter(v => !v.isBooked).length;
            setStats({
                totalVenues: updatedVenues.length,
                availableVenues: availableCount,
                bookedVenues: updatedVenues.length - availableCount
            });
        } catch (error) {
            setError('Failed to fetch venues data');
        }
    };

    const isTimeOverlapping = (start1, end1, start2, end2) => {
        return start1 < end2 && end1 > start2;
    };

    const handleSearch = async () => {
        if (!formData.date || !formData.startTime || !formData.endTime) {
            setError('Please select date and time');
            return;
        }

        setLoading(true);
        try {
            const [venuesResponse, bookingsResponse] = await Promise.all([
                axios.get('http://localhost:8060/api/venues'),
                axios.get('http://localhost:8060/api/venue-bookings')
            ]);

            const currentBookings = bookingsResponse.data.filter(booking =>
                booking.venueBookingDate === formData.date
            );

            const filteredVenues = venuesResponse.data.map(venue => {
                const isBooked = currentBookings.some(booking =>
                    booking.venueId === venue.venueId &&
                    isTimeOverlapping(booking.startTime, booking.endTime, formData.startTime, formData.endTime)
                );

                const meetsRequirements = 
                    (!formData.hasAc || venue.hasAc) &&
                    (!formData.hasProjector || venue.hasProjector) &&
                    (!formData.attendees || venue.venueCapacity >= parseInt(formData.attendees));

                return {
                    ...venue,
                    isBooked,
                    isAvailable: !isBooked && meetsRequirements
                };
            });

            setVenues(filteredVenues);
            setShowVenues(true);
            setError('');
        } catch (error) {
            setError('Failed to fetch venue data');
        } finally {
            setLoading(false);
        }
    };

    const handleVenueClick = (venue) => {
        if (!venue.isAvailable) {
            const element = document.getElementById(`venue-${venue.venueId}`);
            element?.classList.add('vibrate');
            setTimeout(() => element?.classList.remove('vibrate'), 500);
            setError('This venue is not available for the selected time');
            return;
        }
        setSelectedVenue(venue);
        setError('');
    };

    const handleBooking = async () => {
        if (!selectedVenue) return;

        try {
            const bookingData = {
                userId: 1, // Replace with actual logged in user ID
                venueId: selectedVenue.venueId,
                venueBookingDate: formData.date,
                startTime: formData.startTime,
                endTime: formData.endTime
            };

            await axios.post('http://localhost:8060/api/venue-bookings', bookingData);

            // Update local state
            const updatedVenues = venues.map(venue =>
                venue.venueId === selectedVenue.venueId
                    ? { ...venue, isBooked: true, isAvailable: false }
                    : venue
            );
            setVenues(updatedVenues);

            // Update stats
            setStats(prev => ({
                ...prev,
                availableVenues: prev.availableVenues - 1,
                bookedVenues: prev.bookedVenues + 1
            }));

            setError('Booking successful!');
            setSelectedVenue(null);
            fetchInitialData(); // Refresh all data
        } catch (error) {
            setError('Failed to book venue');
        }
    };

    return (
        <div className="venue-layout-container">
            <div className="booking-header">
                <h1>Venue Booking System</h1>
                {error && (
                    <div className={`alert ${error.includes('successful') ? 'alert-success' : 'alert-error'}`}>
                        {error}
                    </div>
                )}
            </div>

            {/* Statistics */}
            <div className="stats-container">
                <div className="stat-item">
                    <div className="stat-icon">🏢</div>
                    <span className="stat-label">Total Venues</span>
                    <span className="stat-value">{stats.totalVenues}</span>
                </div>
                <div className="stat-item">
                    <div className="stat-icon">✅</div>
                    <span className="stat-label">Available</span>
                    <span className="stat-value text-green-600">{stats.availableVenues}</span>
                </div>
                <div className="stat-item">
                    <div className="stat-icon">🔒</div>
                    <span className="stat-label">Booked</span>
                    <span className="stat-value text-red-600">{stats.bookedVenues}</span>
                </div>
            </div>

            {/* Search Form */}
            <div className="booking-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label>Date</label>
                        <input
                            type="date"
                            value={formData.date}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Start Time</label>
                        <input
                            type="time"
                            value={formData.startTime}
                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>End Time</label>
                        <input
                            type="time"
                            value={formData.endTime}
                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        />
                    </div>

                    <div className="form-group">
                        <label>Number of Attendees</label>
                        <input
                            type="number"
                            value={formData.attendees}
                            onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                            min="1"
                        />
                    </div>

                    <div className="checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.hasAc}
                                onChange={(e) => setFormData({ ...formData, hasAc: e.target.checked })}
                            />
                            AC Required
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.hasProjector}
                                onChange={(e) => setFormData({ ...formData, hasProjector: e.target.checked })}
                            />
                            Projector Required
                        </label>
                    </div>

                    <button 
                        className={`search-button ${loading ? 'loading' : ''}`}
                        onClick={handleSearch}
                        disabled={loading}
                    >
                        {loading ? 'Searching...' : 'Search Available Venues'}
                    </button>
                </div>
            </div>

            {/* Venues Display */}
            {showVenues && (
                <div className="venue-grid">
                    {venues.map(venue => (
                        <div
                            key={venue.venueId}
                            id={`venue-${venue.venueId}`}
                            className={`venue-card ${
                                venue.isBooked ? 'booked' : 
                                venue.isAvailable ? 'available' : 'unavailable'
                            } ${selectedVenue?.venueId === venue.venueId ? 'selected' : ''}`}
                            onClick={() => handleVenueClick(venue)}
                        >
                            <div className="venue-header">
                                <h3>{venue.venueName}</h3>
                                <span className={`venue-status ${venue.isBooked ? 'booked' : 'available'}`}>
                                    {venue.isBooked ? '🔴 Booked' : venue.isAvailable ? '🟢 Available' : '⚠️ Unsuitable'}
                                </span>
                            </div>
                            
                            <div className="venue-details">
                                <p>
                                    <span className="icon">📍</span>
                                    {venue.venueBuilding} - {venue.venueFloor}
                                </p>
                                <p>
                                    <span className="icon">👥</span>
                                    Capacity: {venue.venueCapacity}
                                </p>
                                <div className="venue-features">
                                    {venue.hasAc && <span className="feature">❄️ AC</span>}
                                    {venue.hasProjector && <span className="feature">📽️ Projector</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Booking Confirmation */}
            {selectedVenue && (
                <div className="booking-footer">
                    <div className="selected-venue-info">
                        <h3>Selected Venue: {selectedVenue.venueName}</h3>
                        <p>{selectedVenue.venueBuilding} - {selectedVenue.venueFloor}</p>
                        <p>Capacity: {selectedVenue.venueCapacity} people</p>
                    </div>
                    <button className="confirm-button" onClick={handleBooking}>
                        Confirm Booking
                    </button>
                </div>
            )}
        </div>
    );
};

export default VenueBookingComponent;