import { useState } from 'react';
import api from '../services/api';

const WaterTracker = ({ initialWater, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const goal = 8; // Default goal: 8 glasses

  const handleWaterAction = async (action) => {
    try {
      setLoading(true);
      const res = await api.put('/water', { action });
      onUpdate(res.data.glasses);
    } catch (error) {
      console.error('Error updating water:', error);
      alert('Failed to update water');
    } finally {
      setLoading(false);
    }
  };

  // Generate visual representation
  const renderGlasses = () => {
    const glasses = [];
    for (let i = 0; i < goal; i++) {
      glasses.push(
        <div 
          key={i} 
          style={{
            width: '40px',
            height: '60px',
            border: '2px solid var(--primary-color)',
            borderRadius: '0 0 10px 10px',
            margin: '0 5px',
            display: 'inline-block',
            backgroundColor: i < initialWater ? '#bbdefb' : 'transparent', // Light blue if filled
            position: 'relative'
          }}
        >
          {i < initialWater && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              height: '80%',
              backgroundColor: '#2196f3',
              borderRadius: '0 0 8px 8px'
            }}></div>
          )}
        </div>
      );
    }
    return glasses;
  };

  return (
    <div className="card text-center">
      <h2>Water Intake</h2>
      <p className="mb-2">{initialWater} / {goal} glasses</p>
      
      <div style={{ marginBottom: '1.5rem' }}>
        {renderGlasses()}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
        <button 
          className="btn btn-danger btn-sm" 
          onClick={() => handleWaterAction('remove')}
          disabled={loading || initialWater === 0}
        >
          - Remove
        </button>
        <button 
          className="btn btn-sm" 
          onClick={() => handleWaterAction('add')}
          disabled={loading}
        >
          + Add Glass
        </button>
        <button 
          className="btn btn-sm" 
          style={{ backgroundColor: '#757575' }}
          onClick={() => handleWaterAction('reset')}
          disabled={loading || initialWater === 0}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default WaterTracker;
