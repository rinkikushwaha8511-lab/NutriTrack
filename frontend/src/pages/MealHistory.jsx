import { useState, useEffect } from 'react';
import api from '../services/api';
import FoodList from '../components/FoodList';

const MealHistory = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [combinedFoods, setCombinedFoods] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFoodsByDate = async (selectedDate) => {
    try {
      setLoading(true);
      const [mealsRes, foodsRes] = await Promise.all([
        api.get(`/meals/history?date=${selectedDate}`),
        api.get(`/foods/date/${selectedDate}`)
      ]);
      
      const meals = mealsRes.data.map(m => ({
        _id: m._id,
        name: m.name,
        mealType: m.mealType,
        quantity: `${m.servings} serving(s)`,
        calories: m.calories,
        isLegacy: false
      }));

      const foods = foodsRes.data.map(f => ({
        _id: f._id,
        name: f.foodName,
        mealType: f.mealType,
        quantity: f.quantity,
        calories: f.calories,
        isLegacy: true
      }));

      setCombinedFoods([...foods, ...meals]);
    } catch (error) {
      console.error('Failed to fetch foods:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodsByDate(date);
  }, [date]);

  const handleDeleteFood = async (id, isLegacy) => {
    try {
      if (isLegacy) {
        await api.delete(`/foods/${id}`);
      } else {
        await api.delete(`/meals/${id}`);
      }
      fetchFoodsByDate(date);
    } catch (error) {
      console.error('Failed to delete food:', error);
      alert('Failed to delete entry');
    }
  };

  return (
    <div>
      <h1>Meal History</h1>
      <p className="mb-3 text-light">View your past food logs.</p>
      
      <div className="card mb-3">
        <div className="form-group mb-0">
          <label>Select Date:</label>
          <input 
            type="date" 
            className="form-control" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            style={{ maxWidth: '300px' }}
          />
        </div>
      </div>
      
      {loading ? (
        <p>Loading...</p>
      ) : combinedFoods.length > 0 ? (
        <FoodList foods={combinedFoods} onDeleteFood={handleDeleteFood} />
      ) : (
        <div className="card text-center">
          <p>No food records found for this date.</p>
        </div>
      )}
    </div>
  );
};

export default MealHistory;
