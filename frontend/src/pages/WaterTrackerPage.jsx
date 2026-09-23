import { useState, useEffect } from 'react';
import { FaTint, FaPlus, FaTrash } from 'react-icons/fa';
import api from '../services/api';

const WaterTrackerPage = () => {
  const [entries, setEntries] = useState([]);
  const [total, setTotal] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customAmount, setCustomAmount] = useState('');

  // Assume user name and goal are in localStorage, or hardcode 2000ml as default
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const dailyTarget = 2000; // ml

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [todayRes, historyRes] = await Promise.all([
        api.get('/water/today'),
        api.get('/water/history')
      ]);
      setEntries(todayRes.data.entries || []);
      setTotal(todayRes.data.total || 0);
      setHistory(historyRes.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load water data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddWater = async (amount) => {
    try {
      await api.post('/water', { amount });
      setCustomAmount('');
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to log water');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/water/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to delete entry');
    }
  };

  const calculateWidth = (val, target) => {
    if (!target || target === 0) return 0;
    const percentage = (val / target) * 100;
    return percentage > 100 ? 100 : percentage;
  };

  if (loading) return <div className="text-center p-5 text-light">Loading water tracking...</div>;
  if (error) return <div className="card p-4 text-center text-danger bg-dark">{error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="mb-3 text-center"><FaTint style={{ color: '#2196f3' }} /> Water Tracking</h1>
      
      {/* TODAY'S WATER CARD */}
      <div className="card mb-4 text-center p-4">
        <h2>Today's Intake</h2>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2196f3', margin: '1rem 0' }}>
          {total} <span style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}>/ {dailyTarget} ml</span>
        </div>

        <div className="progress-bar-container" style={{ height: '15px', maxWidth: '400px', margin: '0 auto 2rem auto' }}>
          <div 
            className="progress-bar-fill" 
            style={{ 
              width: `${calculateWidth(total, dailyTarget)}%`, 
              backgroundColor: '#2196f3' 
            }}
          ></div>
        </div>

        <h3>Quick Add</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-sm" onClick={() => handleAddWater(250)}>+ 250 ml (1 Glass)</button>
          <button className="btn btn-sm" onClick={() => handleAddWater(500)}>+ 500 ml (1 Bottle)</button>
          
          <div style={{ display: 'flex', gap: '5px' }}>
            <input 
              type="number" 
              placeholder="Custom ml" 
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', width: '120px' }}
            />
            <button 
              className="btn btn-sm" 
              style={{ backgroundColor: '#4caf50' }}
              onClick={() => {
                if(customAmount && Number(customAmount) > 0) handleAddWater(Number(customAmount));
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* TODAY'S ENTRIES */}
        <div className="card">
          <h3 className="mb-3">Today's Entries</h3>
          {entries.length === 0 ? (
            <p className="text-light">No water logged today.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {entries.map(entry => (
                <li key={entry._id} className="card bg-dark mb-2 p-2 flex-between">
                  <span><FaTint color="#2196f3" /> {entry.amount} ml</span>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(entry._id)}>
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* HISTORY */}
        <div className="card">
          <h3 className="mb-3">History</h3>
          {history.length === 0 ? (
            <p className="text-light">No history available.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {history.map((h, i) => (
                <li key={i} className="card bg-dark mb-2 p-2 flex-between">
                  <strong>{h.date}</strong>
                  <span style={{ color: '#2196f3', fontWeight: 'bold' }}>{h.total} ml</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaterTrackerPage;
