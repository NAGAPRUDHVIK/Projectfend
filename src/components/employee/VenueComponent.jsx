import React, { useState } from 'react';

const VenueComponent = () => {
    const [selectedVenue, setSelectedVenue] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);

    const venueData = {
        totalVenues: 20,
        availableVenues: 8,
        myBookings: [],
        venues: [
            { 
                id: 1, 
                name: "Conference Room A",
                capacity: 20,
                amenities: ["Projector", "Video Conference", "Whiteboard"],
                status: "available"
            },
            { 
                id: 2, 
                name: "Meeting Room B",
                capacity: 10,
                amenities: ["TV Screen", "Video Conference"],
                status: "available"
            },
            { 
                id: 3, 
                name: "Auditorium",
                capacity: 100,
                amenities: ["Stage", "Audio System", "Projector"],
                status: "occupied"
            }
        ]
    };

    const handleBooking = () => {
        // Handle booking logic
        setShowBookingModal(true);
    };

    return (
        <main className="dashboard-main">
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Venues</h3>
                    <p>{venueData.totalVenues}</p>
                </div>
                <div className="stat-card">
                    <h3>Available Venues</h3>
                    <p>{venueData.availableVenues}</p>
                </div>
                <div className="stat-card">
                    <h3>Occupancy Rate</h3>
                    <p>{Math.round((venueData.totalVenues - venueData.availableVenues) / venueData.totalVenues * 100)}%</p>
                </div>
            </div>

            <div className="detailed-stats">
                {/* Venue Listing */}
                <div className="detail-card">
                    <h3 className="text-xl font-semibold mb-4">Available Venues</h3>
                    <div className="space-y-4">
                        {venueData.venues.map(venue => (
                            <div 
                                key={venue.id} 
                                className="p-4 border rounded-lg hover:border-black transition-colors cursor-pointer"
                                onClick={() => setSelectedVenue(venue)}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold">{venue.name}</h4>
                                    <span className={`badge ${venue.status === 'available' ? 'bg-green-500' : 'bg-red-500'}`}>
                                        {venue.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">Capacity: {venue.capacity} people</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {venue.amenities.map((amenity, index) => (
                                        <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                            {amenity}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Booking Form */}
                <div className="detail-card">
                    <h3 className="text-xl font-semibold mb-4">Book a Venue</h3>
                    <div className="space-y-4">
                        <select className="w-full p-2 border rounded">
                            <option value="">Select Venue</option>
                            {venueData.venues
                                .filter(venue => venue.status === 'available')
                                .map(venue => (
                                    <option key={venue.id} value={venue.id}>
                                        {venue.name} (Capacity: {venue.capacity})
                                    </option>
                                ))
                            }
                        </select>

                        <input
                            type="date"
                            className="w-full p-2 border rounded"
                            min={new Date().toISOString().split('T')[0]}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <select className="w-full p-2 border rounded">
                                <option value="">Start Time</option>
                                <option value="09:00">09:00 AM</option>
                                <option value="10:00">10:00 AM</option>
                                <option value="11:00">11:00 AM</option>
                                <option value="12:00">12:00 PM</option>
                                <option value="13:00">01:00 PM</option>
                                <option value="14:00">02:00 PM</option>
                                <option value="15:00">03:00 PM</option>
                                <option value="16:00">04:00 PM</option>
                                <option value="17:00">05:00 PM</option>
                            </select>

                            <select className="w-full p-2 border rounded">
                                <option value="">End Time</option>
                                <option value="10:00">10:00 AM</option>
                                <option value="11:00">11:00 AM</option>
                                <option value="12:00">12:00 PM</option>
                                <option value="13:00">01:00 PM</option>
                                <option value="14:00">02:00 PM</option>
                                <option value="15:00">03:00 PM</option>
                                <option value="16:00">04:00 PM</option>
                                <option value="17:00">05:00 PM</option>
                                <option value="18:00">06:00 PM</option>
                            </select>
                        </div>

                        <textarea
                            className="w-full p-2 border rounded"
                            placeholder="Purpose of booking"
                            rows="3"
                        ></textarea>

                        <input
                            type="number"
                            className="w-full p-2 border rounded"
                            placeholder="Number of attendees"
                            min="1"
                        />

                        <button 
                            onClick={handleBooking}
                            className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Request Booking
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default VenueComponent;