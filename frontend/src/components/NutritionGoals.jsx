import { useState, useEffect } from 'react';
import api from '../services/api';

const NutritionGoals = () => {
  const [goals, setGoals] = useState({
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fats: 0,
    water: 8
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await api.get('/goals');
      if (res.data) setGoals(res.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setMessage({ type: 'info', text: 'No goals found. Please set them or auto-calculate.' });
      } else {
        console.error('Error fetching goals:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setGoals({ ...goals, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      const res = await api.put('/goals', goals);
      setGoals(res.data);
      setMessage({ type: 'success', text: 'Goals saved successfully!' });
    } catch (error) {
      console.error('Error saving goals:', error);
      setMessage({ type: 'error', text: 'Failed to save goals.' });
    } finally {
      setSaving(false);
    }
  };

  const handleAutoCalculate = async () => {
    try {
      setCalculating(true);
      setMessage({ type: '', text: '' });
      const res = await api.post('/goals/calculate');
      setGoals(res.data);
      setMessage({ type: 'success', text: 'Goals auto-calculated based on your profile!' });
    } catch (error) {
      console.error('Error calculating goals:', error);
      setMessage({ type: 'error', text: 'Failed to calculate goals. Please save your profile first.' });
    } finally {
      setCalculating(false);
    }
  };

  if (loading) return <div>Loading goals...</div>;

  return (
    <div className="card mt-4" style={{ maxWidth: '600px' }}>
      <h2>Nutrition Goals</h2>
      <p className="text-light mb-3">Set your daily targets or let us calculate them for you based on your profile.</p>

      {message.text && (
        <div className={`mb-3 p-2 text-center ${message.type === 'success' ? 'text-success' : message.type === 'info' ? 'text-light' : 'text-danger'}`}>
          {message.text}
        </div>
      )}

      <button type="button" className="btn btn-secondary mb-3" style={{ width: '100%' }} onClick={handleAutoCalculate} disabled={calculating}>
        {calculating ? 'Calculating...' : 'Auto-Calculate from Profile'}
      </button>

      <form onSubmit={handleSave}>
        <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="form-group">
            <label>Calories (kcal)</label>
            <input type="number" name="calories" className="form-control" value={goals.calories} onChange={handleChange} required min="500" />
          </div>
          <div className="form-group">
            <label>Protein (g)</label>
            <input type="number" name="protein" className="form-control" value={goals.protein} onChange={handleChange} required min="0" />
          </div>
        </div>

        <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="form-group">
            <label>Carbohydrates (g)</label>
            <input type="number" name="carbohydrates" className="form-control" value={goals.carbohydrates} onChange={handleChange} required min="0" />
          </div>
          <div className="form-group">
            <label>Fats (g)</label>
            <input type="number" name="fats" className="form-control" value={goals.fats} onChange={handleChange} required min="0" />
          </div>
        </div>

        <div className="form-group">
          <label>Water (Glasses)</label>
          <input type="number" name="water" className="form-control" value={goals.water} onChange={handleChange} required min="1" />
        </div>

        <button type="submit" className="btn btn-block" disabled={saving}>
          {saving ? 'Saving...' : 'Save Goals'}
        </button>
      </form>
    </div>
  );
};

export default NutritionGoals;
