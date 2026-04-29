import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [grievances, setGrievances] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Academic'
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [student, setStudent] = useState(null);

  const API = "https://student-grievance-management-system-q36t.onrender.com";

  useEffect(() => {
    const studentData = localStorage.getItem('student');

    if (studentData) {
      setStudent(JSON.parse(studentData));
    }

    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API}/api/grievances`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGrievances(res.data);
    } catch (err) {
      setError('Failed to fetch grievances');
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
        await axios.put(`${API}/api/grievances/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEditingId(null);
      } else {
        await axios.post(`${API}/api/grievances`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setFormData({ title: '', description: '', category: 'Academic' });
      fetchGrievances();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (grievance) => {
    setFormData({
      title: grievance.title,
      description: grievance.description,
      category: grievance.category
    });
    setEditingId(grievance._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this grievance?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API}/api/grievances/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchGrievances();
      } catch (err) {
        setError('Failed to delete grievance');
      }
    }
  };

  const handleSearch = async () => {
    if (!searchTerm) {
      fetchGrievances();
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API}/api/grievances/search?title=${searchTerm}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGrievances(res.data);
    } catch (err) {
      setError('Search failed');
    }
  };

  const { title, description, category } = formData;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Student Grievance Dashboard</h2>
        <div className="user-info">
          <span>Welcome, {student?.name}</span>
          <button onClick={handleLogout} className="btn logout-btn">Logout</button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="dashboard-content">
        <div className="form-section">
          <h3>{editingId ? 'Edit Grievance' : 'Submit New Grievance'}</h3>

          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />

            <select
              value={category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="Academic">Academic</option>
              <option value="Hostel">Hostel</option>
              <option value="Transport">Transport</option>
              <option value="Other">Other</option>
            </select>

            <button type="submit" className="btn">
              {editingId ? 'Update' : 'Submit'}
            </button>
          </form>
        </div>

        <div className="grievances-section">
          <h3>Your Grievances</h3>

          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button onClick={handleSearch}>Search</button>

          {grievances.map((g) => (
            <div key={g._id}>
              <h4>{g.title}</h4>
              <p>{g.description}</p>

              <button onClick={() => handleEdit(g)}>Edit</button>
              <button onClick={() => handleDelete(g._id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;