import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClockIcon } from '@heroicons/react/24/outline';

interface TimeEntry {
  id: string;
  employeeName: string;
  clockIn: string;
  clockOut?: string;
  date: string;
}

const TimeTracker: React.FC = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClockIn = () => {
    if (!employeeName.trim()) {
      alert('Please enter your name');
      return;
    }

    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      employeeName: employeeName.trim(),
      clockIn: currentTime.toLocaleTimeString(),
      date: currentTime.toLocaleDateString(),
    };

    setTimeEntries([...timeEntries, newEntry]);
    setIsClockedIn(true);
  };

  const handleClockOut = () => {
    const updatedEntries = timeEntries.map(entry => {
      if (entry.employeeName === employeeName.trim() && !entry.clockOut) {
        return {
          ...entry,
          clockOut: currentTime.toLocaleTimeString(),
        };
      }
      return entry;
    });

    setTimeEntries(updatedEntries);
    setIsClockedIn(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Time Tracker</h1>
          <p className="text-gray-600 mt-2">
            {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              id="employeeName"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={isClockedIn ? handleClockOut : handleClockIn}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white font-medium ${
              isClockedIn ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            <ClockIcon className="h-5 w-5" />
            {isClockedIn ? 'Clock Out' : 'Clock In'}
          </motion.button>
        </div>

        {timeEntries.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Today's Entries</h2>
            <div className="space-y-2">
              {timeEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-gray-50 p-3 rounded-md text-sm text-gray-700"
                >
                  <p className="font-medium">{entry.employeeName}</p>
                  <p>In: {entry.clockIn}</p>
                  {entry.clockOut && <p>Out: {entry.clockOut}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeTracker; 