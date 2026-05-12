import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const API = "https://student-grievance-management-system-q36t.onrender.com";

  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    destinationName: '',
    travelDate: '',
    numberOfTravelers: '',
    packageType: 'Silver',
    price: '',
    contactAddress: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('student');

    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');

      console.log("TOKEN:", token); // DEBUG

      const res = await axios.get(`${API}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("DATA:", res.data); // DEBUG

      setBookings(res.data);
    } catch (err) {
      console.error("FETCH ERROR:", err); // DEBUG
      setError('Failed to fetch bookings');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('student');
    window.location.href = "/login";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      if (editingId) {
        await axios.put(`${API}/api/bookings/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEditingId(null);
      } else {
        await axios.post(`${API}/api/bookings`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setFormData({ destinationName: '', travelDate: '', numberOfTravelers: '', packageType: 'Silver', price: '', contactAddress: '' });
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (booking) => {
    setFormData({
      destinationName: booking.destinationName,
      travelDate: booking.travelDate,
      numberOfTravelers: booking.numberOfTravelers,
      packageType: booking.packageType,
      price: booking.price,
      contactAddress: booking.contactAddress
    });
    setEditingId(booking._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API}/api/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchBookings();
      } catch (err) {
        setError('Failed to delete booking');
      }
    }
  };

  const handleSearch = async () => {
    if (!searchTerm) {
      fetchBookings();
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API}/api/bookings/search?destination=${searchTerm}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
    } catch (err) {
      setError('Search failed');
    }
  };

  const { destinationName, travelDate, numberOfTravelers, packageType, price, contactAddress } = formData;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Travel Package Booking Dashboard</h2>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="btn logout-btn">Logout</button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="dashboard-content">
        <div className="form-section">
          <h3>{editingId ? 'Edit Booking' : 'Create New Booking'}</h3>

          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Destination Name"
              value={destinationName}
              onChange={(e) => setFormData({...formData, destinationName: e.target.value})}
              required
            />

            <input
              type="date"
              placeholder="Travel Date"
              value={travelDate}
              onChange={(e) => setFormData({...formData, travelDate: e.target.value})}
              required
            />

            <input
              type="number"
              placeholder="Number of Travelers"
              value={numberOfTravelers}
              onChange={(e) => setFormData({...formData, numberOfTravelers: e.target.value})}
              required
            />

            <select
              value={packageType}
              onChange={(e) => setFormData({...formData, packageType: e.target.value})}
            >
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
              <option value="Platinum">Platinum</option>
            </select>

            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
            />

            <textarea
              placeholder="Contact Address"
              value={contactAddress}
              onChange={(e) => setFormData({...formData, contactAddress: e.target.value})}
              required
            />

            <button type="submit" className="btn">
              {editingId ? 'Update Booking' : 'Create Booking'}
            </button>
          </form>
        </div>

        <div className="bookings-section">
          <h3>Your Travel Bookings</h3>

          <input
            type="text"
            placeholder="Search destinations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button onClick={handleSearch}>Search</button>

          {bookings.length === 0 ? (
            <p>No bookings found</p>
          ) : (
            bookings.map((booking) => (
              <div key={booking._id} className="booking-item">
                <h4>{booking.destinationName}</h4>
                <p><strong>Travel Date:</strong> {booking.travelDate}</p>
                <p><strong>Travelers:</strong> {booking.numberOfTravelers}</p>
                <p><strong>Package:</strong> {booking.packageType}</p>
                <p><strong>Price:</strong> ${booking.price}</p>
                <p><strong>Status:</strong> {booking.bookingStatus || 'Confirmed'}</p>
                <p><strong>Contact:</strong> {booking.contactAddress}</p>

                <button onClick={() => handleEdit(booking)}>Edit</button>
                <button onClick={() => handleDelete(booking._id)}>Delete</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;