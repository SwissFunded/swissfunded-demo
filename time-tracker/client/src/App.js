import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [employeeName, setEmployeeName] = useState('');
  const [activeSession, setActiveSession] = useState(null);
  const [timeEntries, setTimeEntries] = useState([]);
  const [stats, setStats] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([fetchTimeEntries(), fetchStats()]);
      } catch (err) {
        console.error('Initialization error:', err);
        setError('Failed to load initial data');
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  const fetchTimeEntries = async () => {
    try {
      console.log('Fetching time entries from:', `${API_URL}/api/time-entries`);
      const response = await axios.get(`${API_URL}/api/time-entries`);
      console.log('Time entries response:', response.data);
      setTimeEntries(response.data);
    } catch (error) {
      console.error('Time entries error:', error);
      setError('Failed to fetch time entries');
      throw error;
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/time-entries/stats`);
      setStats(response.data);
    } catch (error) {
      setError('Failed to fetch statistics');
    }
  };

  const handleClockIn = async () => {
    if (!employeeName) {
      setError('Please enter your name');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/time-entries/clock-in`, {
        employeeName,
      });
      setActiveSession(response.data);
      setError('');
      fetchTimeEntries();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to clock in');
    }
  };

  const handleClockOut = async () => {
    if (!employeeName) {
      setError('Please enter your name');
      return;
    }

    try {
      await axios.post(`${API_URL}/api/time-entries/clock-out`, {
        employeeName,
      });
      setActiveSession(null);
      setError('');
      fetchTimeEntries();
      fetchStats();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to clock out');
    }
  };

  const handleDeleteEntry = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/time-entries/${id}`);
      fetchTimeEntries();
      fetchStats();
    } catch (error) {
      setError('Failed to delete time entry');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Time Tracker</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <p>Loading...</p>
            <p className="text-sm text-gray-500 mt-2">API URL: {API_URL}</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="mb-4">
                <input
                  type="text"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleClockIn}
                  disabled={activeSession}
                  className={`px-4 py-2 rounded ${
                    activeSession ? 'bg-gray-300' : 'bg-green-500 text-white'
                  }`}
                >
                  Clock In
                </button>
                <button
                  onClick={handleClockOut}
                  disabled={!activeSession}
                  className={`px-4 py-2 rounded ${
                    !activeSession ? 'bg-gray-300' : 'bg-red-500 text-white'
                  }`}
                >
                  Clock Out
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Employee Statistics</h2>
              <div className="space-y-4">
                {stats.map((stat) => (
                  <div key={stat._id} className="flex justify-between items-center">
                    <span>{stat._id}</span>
                    <span className="font-semibold">{stat.totalHours.toFixed(2)} hours</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Time Entries</h2>
              <div className="space-y-4">
                {timeEntries.map((entry) => (
                  <div key={entry._id} className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold">{entry.employeeName}</span>
                      <span className="text-gray-500 ml-2">
                        {new Date(entry.clockIn).toLocaleString()}
                        {entry.clockOut && ` - ${new Date(entry.clockOut).toLocaleString()}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{entry.totalHours.toFixed(2)} hours</span>
                      <button
                        onClick={() => handleDeleteEntry(entry._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App; 