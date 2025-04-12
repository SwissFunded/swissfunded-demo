const express = require('express');
const router = express.Router();
const TimeEntry = require('../models/TimeEntry');

// Clock in
router.post('/clock-in', async (req, res) => {
  try {
    const { employeeName } = req.body;
    
    // Check if employee already has an active session
    const activeEntry = await TimeEntry.findOne({
      employeeName,
      isActive: true,
    });

    if (activeEntry) {
      return res.status(400).json({ message: 'You already have an active session' });
    }

    const timeEntry = new TimeEntry({
      employeeName,
      clockIn: new Date(),
    });

    await timeEntry.save();
    res.status(201).json(timeEntry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Clock out
router.post('/clock-out', async (req, res) => {
  try {
    const { employeeName } = req.body;
    
    const activeEntry = await TimeEntry.findOne({
      employeeName,
      isActive: true,
    });

    if (!activeEntry) {
      return res.status(400).json({ message: 'No active session found' });
    }

    const clockOutTime = new Date();
    const clockInTime = activeEntry.clockIn;
    const totalHours = (clockOutTime - clockInTime) / (1000 * 60 * 60);

    activeEntry.clockOut = clockOutTime;
    activeEntry.totalHours = totalHours;
    activeEntry.isActive = false;

    await activeEntry.save();
    res.json(activeEntry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all time entries
router.get('/', async (req, res) => {
  try {
    const timeEntries = await TimeEntry.find().sort({ createdAt: -1 });
    res.json(timeEntries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete time entry
router.delete('/:id', async (req, res) => {
  try {
    const timeEntry = await TimeEntry.findByIdAndDelete(req.params.id);
    if (!timeEntry) {
      return res.status(404).json({ message: 'Time entry not found' });
    }
    res.json({ message: 'Time entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get employee statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await TimeEntry.aggregate([
      {
        $match: { isActive: false }
      },
      {
        $group: {
          _id: '$employeeName',
          totalHours: { $sum: '$totalHours' },
          entries: { $sum: 1 }
        }
      },
      {
        $sort: { totalHours: -1 }
      }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 