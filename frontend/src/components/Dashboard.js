import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const studentData = localStorage.getItem('student');
    
    if (!token || !studentData) {
      navigate('/login');
      return;
    }

    setStudent(JSON.parse(studentData));
    fetchGrievances();
  }, [navigate]);

  const fetchGrievances = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(process.env.REACT_APP_API_URL || 'https://student-grievance-management-system-q36t.onrender.com/api/grievances', {
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
    navigate('/login');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      if (editingId) {
        await axios.put(`${process.env.REACT_APP_API_URL || 'https://student-grievance-management-system-q36t.onrender.com'}/api/grievances/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEditingId(null);
      } else {
        await axios.post(process.env.REACT_APP_API_URL || 'https://student-grievance-management-system-q36t.onrender.com/api/grievances', formData, {
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
        await axios.delete(`${process.env.REACT_APP_API_URL || 'https://student-grievance-management-system-q36t.onrender.com'}/api/grievances/${id}`, {
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
      const res = await axios.get(`${process.env.REACT_APP_API_URL || 'https://student-grievance-management-system-q36t.onrender.com'}/api/grievances/search?title=${searchTerm}`, {
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
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                name="description"
                value={description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Category:</label>
              <select
                name="category"
                value={category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Academic">Academic</option>
                <option value="Hostel">Hostel</option>
                <option value="Transport">Transport</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button type="submit" className="btn">
              {editingId ? 'Update Grievance' : 'Submit Grievance'}
            </button>
            {editingId && (
              <button 
                type="button" 
                className="btn cancel-btn"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ title: '', description: '', category: 'Academic' });
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        <div className="grievances-section">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch} className="btn">Search</button>
            <button onClick={fetchGrievances} className="btn">Clear</button>
          </div>

          <h3>Your Grievances</h3>
          <div className="grievances-list">
            {grievances.length === 0 ? (
              <p>No grievances found.</p>
            ) : (
              grievances.map(grievance => (
                <div key={grievance._id} className="grievance-card">
                  <h4>{grievance.title}</h4>
                  <p><strong>Category:</strong> {grievance.category}</p>
                  <p><strong>Description:</strong> {grievance.description}</p>
                  <p><strong>Status:</strong> <span className={`status ${grievance.status.toLowerCase()}`}>{grievance.status}</span></p>
                  <p><strong>Date:</strong> {new Date(grievance.date).toLocaleDateString()}</p>
                  <div className="grievance-actions">
                    <button onClick={() => handleEdit(grievance)} className="btn edit-btn">Edit</button>
                    <button onClick={() => handleDelete(grievance._id)} className="btn delete-btn">Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
