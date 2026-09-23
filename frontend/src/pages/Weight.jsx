import { useState, useEffect } from 'react';
import { FaWeight, FaTrash, FaCheck } from 'react-icons/fa';
import api from '../services/api';

const Weight = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form state
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Profile data for BMI
  const [userInfo, setUserInfo] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/weight');
      setHistory(res.data || []);
      
      // Get latest user info from API and preserve token in localStorage
      const profileRes = await api.get('/users/profile');
      const storedUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const updatedUser = { ...storedUser, ...profileRes.data };
      setUserInfo(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    } catch (err) {
      console.error(err);
      setError('Failed to load weight history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddWeight = async (e) => {
    e.preventDefault();
    if (!weight || Number(weight) <= 0) return alert('Enter a valid weight');
    
    try {
      await api.post('/weight', { weight: Number(weight), date });
      setWeight('');
      fetchData(); // Refresh list and profile
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to log weight');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/weight/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete entry');
    }
  };

  // BMI Calculation
  const calculateBMI = () => {
    if (!userInfo || !userInfo.height || !userInfo.weight || userInfo.height <= 0 || userInfo.weight <= 0) {
      return null;
    }
    const heightInMeters = userInfo.height / 100;
    const bmi = userInfo.weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(2);
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: '#ff9800' };
    if (bmi >= 18.5 && bmi <= 24.9) return { category: 'Normal', color: '#4caf50' };
    if (bmi >= 25 && bmi <= 29.9) return { category: 'Overweight', color: '#ff9800' };
    return { category: 'Obesity', color: '#f44336' };
  };

  const bmiValue = calculateBMI();
  const bmiInfo = bmiValue ? getBMICategory(Number(bmiValue)) : null;

  if (loading) return <div className="text-center p-5 text-light">Loading weight tracking...</div>;
  if (error) return <div className="card p-4 text-center text-danger bg-dark">{error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="mb-4 text-center"><FaWeight style={{ color: 'var(--accent)' }} /> Weight Tracking</h1>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        
        <div>
          {/* LOG WEIGHT FORM */}
          <div className="card mb-3">
            <h3 className="mb-3">Log Weight</h3>
            <form onSubmit={handleAddWeight}>
              <div className="mb-2">
                <label className="text-light" style={{ display: 'block', marginBottom: '5px' }}>Date</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                />
              </div>
              <div className="mb-3">
                <label className="text-light" style={{ display: 'block', marginBottom: '5px' }}>Weight (kg)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={weight} 
                  onChange={(e) => setWeight(e.target.value)} 
                  placeholder="e.g. 70.5" 
                  required 
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid var(--border)' }}
                />
              </div>
              <button type="submit" className="btn btn-block" style={{ backgroundColor: 'var(--accent)' }}>
                <FaCheck /> Save Weight
              </button>
            </form>
          </div>

          {/* BMI CARD */}
          <div className="card text-center">
            <h3 className="mb-3">BMI Calculator</h3>
            {bmiValue ? (
              <>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{bmiValue}</div>
                <div style={{ fontSize: '1.2rem', color: bmiInfo.color, fontWeight: 'bold', margin: '0.5rem 0' }}>
                  {bmiInfo.category}
                </div>
                <p className="text-light" style={{ fontSize: '0.85rem', marginTop: '1rem' }}>
                  * BMI is a general screening measure and is not a medical diagnosis. Based on Height: {userInfo.height}cm, Weight: {userInfo.weight}kg.
                </p>
              </>
            ) : (
              <div className="text-light">
                <p className="mb-2">BMI unavailable.</p>
                <p style={{ fontSize: '0.9rem' }}>Please complete your height and weight in your profile.</p>
              </div>
            )}
          </div>
        </div>

        {/* HISTORY LIST */}
        <div className="card">
          <h3 className="mb-3">Weight History</h3>
          <div className="text-light mb-2">
            Current Profile Weight: <strong style={{ color: '#fff' }}>{userInfo?.weight} kg</strong>
          </div>
          
          {history.length === 0 ? (
            <p className="text-light">No weight logs found.</p>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '10px 5px' }}>Date</th>
                    <th style={{ padding: '10px 5px' }}>Weight</th>
                    <th style={{ padding: '10px 5px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(log => (
                    <tr key={log._id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '10px 5px' }}>{log.date}</td>
                      <td style={{ padding: '10px 5px', fontWeight: 'bold' }}>{log.weight} kg</td>
                      <td style={{ padding: '10px 5px', textAlign: 'right' }}>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(log._id)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Weight;
