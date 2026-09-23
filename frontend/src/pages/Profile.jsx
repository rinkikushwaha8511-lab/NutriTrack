import { useState, useEffect } from 'react';
import api from '../services/api';
import NutritionGoals from '../components/NutritionGoals';

const Profile = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Other',
    height: '',
    weight: '',
    dailyCalorieGoal: '',
    activityLevel: 'Sedentary',
    fitnessGoal: 'Maintain Weight',
    dietaryPreference: 'Other'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile');
        setFormData({
            ...res.data,
            activityLevel: res.data.activityLevel || 'Sedentary',
            fitnessGoal: res.data.fitnessGoal || 'Maintain Weight',
            dietaryPreference: res.data.dietaryPreference || 'Other'
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });
      const res = await api.put('/users/profile', formData);
      
      // Update local storage and app state
      const updatedUser = { ...user, ...res.data };
      updatedUser.token = user.token;
      onUpdate(updatedUser);
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div>
      <h1>Your Profile</h1>
      <p className="mb-3 text-light">Update your personal information and body measurements.</p>

      <div className="card" style={{ maxWidth: '600px' }}>
        {message.text && (
          <div className={`mb-2 p-2 text-center ${message.type === 'success' ? 'text-success' : 'text-danger'}`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group">
              <label>Age</label>
              <input type="number" name="age" className="form-control" value={formData.age} onChange={handleChange} required min="1" />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" className="form-control" value={formData.gender} onChange={handleChange} required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group">
              <label>Height (cm)</label>
              <input type="number" name="height" className="form-control" value={formData.height} onChange={handleChange} required min="1" />
            </div>
            <div className="form-group">
              <label>Weight (kg)</label>
              <input type="number" name="weight" className="form-control" value={formData.weight} onChange={handleChange} required min="1" />
            </div>
          </div>

          <div className="form-group">
            <label>Activity Level</label>
            <select name="activityLevel" className="form-control" value={formData.activityLevel} onChange={handleChange} required>
              <option value="Sedentary">Sedentary</option>
              <option value="Lightly Active">Lightly Active</option>
              <option value="Moderately Active">Moderately Active</option>
              <option value="Very Active">Very Active</option>
            </select>
          </div>

          <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group">
              <label>Fitness Goal</label>
              <select name="fitnessGoal" className="form-control" value={formData.fitnessGoal} onChange={handleChange} required>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Maintain Weight">Maintain Weight</option>
                <option value="Weight Gain">Weight Gain</option>
                <option value="Muscle Gain">Muscle Gain</option>
              </select>
            </div>
            <div className="form-group">
              <label>Dietary Preference</label>
              <select name="dietaryPreference" className="form-control" value={formData.dietaryPreference} onChange={handleChange} required>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-block" disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>

      <NutritionGoals />
    </div>
  );
};

export default Profile;
