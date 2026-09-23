import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FaTrash, FaEdit } from 'react-icons/fa';

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [legacyFoods, setLegacyFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // For Editing
  const [editingMeal, setEditingMeal] = useState(null);
  const [editServings, setEditServings] = useState(1);

  const fetchTodayData = async () => {
    try {
      setLoading(true);
      // Fetch both new meals and legacy foods
      const [mealsRes, foodsRes] = await Promise.all([
        api.get('/meals/today'),
        api.get('/foods/today')
      ]);
      setMeals(mealsRes.data);
      setLegacyFoods(foodsRes.data);
    } catch (error) {
      console.error('Failed to fetch meals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayData();
  }, []);

  const handleDeleteMeal = async (id, isLegacy) => {
    try {
      if (isLegacy) {
        await api.delete(`/foods/${id}`);
      } else {
        await api.delete(`/meals/${id}`);
      }
      fetchTodayData();
    } catch (error) {
      console.error('Failed to delete meal:', error);
      alert('Failed to delete meal');
    }
  };

  const handleUpdateServings = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/meals/${editingMeal._id}`, { servings: Number(editServings) });
      setEditingMeal(null);
      fetchTodayData();
    } catch (error) {
      console.error('Failed to update meal:', error);
      alert('Failed to update meal');
    }
  };

  // Grouping Function
  const groupedMeals = {
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: []
  };

  // Group legacy foods
  legacyFoods.forEach(f => {
    const type = f.mealType === 'Snack' ? 'Snacks' : f.mealType; // Map legacy Snack to Snacks
    if (groupedMeals[type]) {
      groupedMeals[type].push({ ...f, isLegacy: true });
    }
  });

  // Group new meals
  meals.forEach(m => {
    if (groupedMeals[m.mealType]) {
      groupedMeals[m.mealType].push({ ...m, isLegacy: false });
    }
  });

  const calculateTotals = (items) => {
    return items.reduce((acc, item) => ({
      calories: acc.calories + (item.calories || 0),
      protein: acc.protein + (item.protein || 0),
      carbs: acc.carbs + (item.carbohydrates || 0),
      fats: acc.fats + (item.fats || item.fat || 0),
      fiber: acc.fiber + (item.fiber || 0)
    }), { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 });
  };

  const dailyTotals = calculateTotals([...legacyFoods, ...meals]);

  return (
    <div>
      <div className="flex-between mb-3">
        <div>
          <h1>Meal Tracker</h1>
          <p className="text-light">Track everything you eat today.</p>
        </div>
        <Link to="/food-search" className="btn">Add Food from DB</Link>
      </div>

      <div className="card mb-4" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
        <h3 className="mb-2">Today's Totals</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Calories</div>
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{dailyTotals.calories}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Protein</div>
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{dailyTotals.protein}g</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Carbs</div>
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{dailyTotals.carbs}g</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Fats</div>
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{dailyTotals.fats}g</div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Fiber</div>
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{dailyTotals.fiber}g</div>
          </div>
        </div>
      </div>

      {loading ? <p>Loading meals...</p> : (
        ['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map(mealType => {
          const items = groupedMeals[mealType];
          const sectionTotals = calculateTotals(items);
          
          return (
            <div key={mealType} className="card mb-3 p-0">
              <div className="flex-between" style={{ padding: '15px', borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <h2 className="mb-0">{mealType}</h2>
                <div className="text-light">
                  {sectionTotals.calories} kcal
                </div>
              </div>
              
              <div style={{ padding: '15px' }}>
                {items.length === 0 ? (
                  <p className="text-light text-center my-2">No foods added for {mealType}.</p>
                ) : (
                  items.map(item => (
                    <div key={item._id} className="flex-between mb-2" style={{ padding: '10px', backgroundColor: 'var(--bg-color)', borderRadius: '5px' }}>
                      
                      {/* Editing Mode */}
                      {editingMeal && editingMeal._id === item._id ? (
                        <form onSubmit={handleUpdateServings} style={{ width: '100%', display: 'flex', gap: '10px' }}>
                          <input 
                            type="number" 
                            className="form-control mb-0" 
                            value={editServings} 
                            onChange={e => setEditServings(e.target.value)} 
                            step="0.1" 
                            min="0.1"
                            style={{ width: '100px' }}
                          />
                          <button type="submit" className="btn btn-sm">Save</button>
                          <button type="button" className="btn btn-sm btn-danger" onClick={() => setEditingMeal(null)}>Cancel</button>
                        </form>
                      ) : (
                        <>
                          <div>
                            <strong>{item.name || item.foodName}</strong>
                            <div className="text-light" style={{ fontSize: '0.85rem' }}>
                              {item.isLegacy ? item.quantity : `${item.servings} serving(s)`}
                            </div>
                          </div>
                          
                          <div className="flex-between" style={{ gap: '15px' }}>
                            <div className="text-right">
                              <div style={{ fontWeight: 'bold' }}>{item.calories} kcal</div>
                              <div className="text-light" style={{ fontSize: '0.75rem' }}>
                                {item.protein}g P • {item.carbohydrates}g C • {item.fats || item.fat}g F
                              </div>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '5px' }}>
                              {!item.isLegacy && (
                                <button className="btn btn-sm" style={{ padding: '5px 8px', backgroundColor: '#9e9e9e' }} onClick={() => {
                                  setEditingMeal(item);
                                  setEditServings(item.servings);
                                }}>
                                  <FaEdit />
                                </button>
                              )}
                              <button className="btn btn-sm btn-danger" style={{ padding: '5px 8px' }} onClick={() => handleDeleteMeal(item._id, item.isLegacy)}>
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Meals;
