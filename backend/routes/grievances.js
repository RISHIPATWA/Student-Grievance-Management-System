const express = require('express');
const Grievance = require('../models/Grievance');
const auth = require('../middleware/auth');
const router = express.Router();

// Submit a grievance
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const grievance = new Grievance({
      title,
      description,
      category,
      student: req.student.id
    });

    await grievance.save();
    await grievance.populate('student', 'name email');

    res.status(201).json(grievance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all grievances for the logged-in student
router.get('/', auth, async (req, res) => {
  try {
    const grievances = await Grievance.find({ student: req.student.id })
      .populate('student', 'name email')
      .sort({ date: -1 });
    
    res.json(grievances);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific grievance by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id)
      .populate('student', 'name email');
    
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    // Check if the grievance belongs to the logged-in student
    if (grievance.student._id.toString() !== req.student.id) {
      return res.status(403).json({ message: 'Not authorized to view this grievance' });
    }

    res.json(grievance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a grievance
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, category, status } = req.body;
    
    let grievance = await Grievance.findById(req.params.id);
    
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    // Check if the grievance belongs to the logged-in student
    if (grievance.student.toString() !== req.student.id) {
      return res.status(403).json({ message: 'Not authorized to update this grievance' });
    }

    grievance = await Grievance.findByIdAndUpdate(
      req.params.id,
      { title, description, category, status },
      { new: true, runValidators: true }
    ).populate('student', 'name email');

    res.json(grievance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a grievance
router.delete('/:id', auth, async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id);
    
    if (!grievance) {
      return res.status(404).json({ message: 'Grievance not found' });
    }

    // Check if the grievance belongs to the logged-in student
    if (grievance.student.toString() !== req.student.id) {
      return res.status(403).json({ message: 'Not authorized to delete this grievance' });
    }

    await Grievance.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Grievance deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search grievances by title
router.get('/search', auth, async (req, res) => {
  try {
    const { title } = req.query;
    
    if (!title) {
      return res.status(400).json({ message: 'Title parameter is required for search' });
    }

    const grievances = await Grievance.find({
      student: req.student.id,
      title: { $regex: title, $options: 'i' }
    }).populate('student', 'name email').sort({ date: -1 });

    res.json(grievances);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
