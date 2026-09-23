import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const FoodSearch = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [error, setError] = useState('');
  
  // Add to meal state
  const [activeFood, setActiveFood] = useState(null);
  const [mealType, setMealType] = useState('Breakfast');
  const [servings, setServings] = useState(1);
  const [logging, setLogging] = useState(false);

  const categories = [
    'All Categories',
    'Fruits',
    'Vegetables',
    'Dairy',
    'Grains',
    'Protein',
    'Beverages',
    'Snacks',
    'Indian Food'
  ];

  const fetchFoods = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      let url = '/food-items';
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category && category !== 'All Categories') params.append('category', category);
      if (params.toString()) url += `?${params.toString()}`;
      const res = await api.get(url);
      setFoods(res.data);
    } catch (err) {
      console.error('Error fetching foods:', err);
      setError('Failed to load foods. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFoods();
  };

  const handleAddToMeal = async (e) => {
    e.preventDefault();
    try {
      setLogging(true);
      await api.post('/meals', {
        foodItemId: activeFood._id,
        mealType,
        servings: Number(servings)
      });
      alert(`Added ${activeFood.name} to ${mealType}!`);
      setActiveFood(null);
      setServings(1);
    } catch (err) {
      console.error('Failed to log meal:', err);
      alert('Failed to log meal. Please try again.');
    } finally {
      setLogging(false);
    }
  };

  return (
    <div>
      <div className="flex-between mb-1" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h1>Food Database</h1>
          <p className="text-light">Search our master database to log foods to your daily meals.</p>
        </div>
        <Link to="/food-suggestions" className="btn" style={{ backgroundColor: '#ffeb3b', color: '#000', whiteSpace: 'nowrap' }}>
          💡 Get Personalized Suggestions
        </Link>
      </div>

      <div className="card mb-4">
        <form onSubmit={handleSearch} className="dashboard-grid" style={{ gridTemplateColumns: '2fr 1fr auto' }}>
          <div className="form-group mb-0">
            <input
              type="text"
              className="form-control"
              placeholder="Search food... (e.g. rice, paneer)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="form-group mb-0">
            <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>
          <div className="form-group mb-0" style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="submit" className="btn btn-block mb-0" style={{ height: '40px' }}>Search</button>
          </div>
        </form>
      </div>

      {error && <div className="p-2 mb-3 text-danger text-center bg-dark" style={{ borderRadius: '5px' }}>{error}</div>}

      {loading ? (
        <div className="text-center p-5 text-light">Loading foods...</div>
      ) : foods.length === 0 ? (
        <div className="card text-center p-5 text-light">
          No foods found matching your search. Try different keywords or categories.
        </div>
      ) : (
        <div className="dashboard-grid mt-4">
          {foods.map((food) => (
            <div key={food._id} className="card p-3">
              <div className="flex-between mb-1">
                <h3 className="mb-0">{food.name}</h3>
                {activeFood && activeFood._id === food._id ? (
                  <button className="btn btn-sm btn-danger" onClick={() => setActiveFood(null)}>Cancel</button>
                ) : (
                  <button className="btn btn-sm" onClick={() => setActiveFood(food)}>Add to Meal</button>
                )}
              </div>

              <p className="text-light mb-3" style={{ fontSize: '0.9rem' }}>
                <span style={{
                  display: 'inline-block', padding: '2px 8px',
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                  color: 'var(--primary)', borderRadius: '12px', marginRight: '10px'
                }}>
                  {food.category}
                </span>
                {food.servingSize} {food.servingUnit}
              </p>

              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: '10px', paddingTop: '15px', borderTop: '1px solid var(--border)'
              }}>
                <div><div className="text-light" style={{ fontSize: '0.8rem' }}>Calories</div><div style={{ fontWeight: '600' }}>{food.calories} kcal</div></div>
                <div><div className="text-light" style={{ fontSize: '0.8rem' }}>Protein</div><div style={{ fontWeight: '600' }}>{food.protein} g</div></div>
                <div><div className="text-light" style={{ fontSize: '0.8rem' }}>Carbs</div><div style={{ fontWeight: '600' }}>{food.carbohydrates} g</div></div>
                <div><div className="text-light" style={{ fontSize: '0.8rem' }}>Fats</div><div style={{ fontWeight: '600' }}>{food.fats} g</div></div>
                <div><div className="text-light" style={{ fontSize: '0.8rem' }}>Fiber</div><div style={{ fontWeight: '600' }}>{food.fiber} g</div></div>
              </div>

              {/* Add to Meal Inline Form */}
              {activeFood && activeFood._id === food._id && (
                <div className="mt-3 p-3 bg-dark" style={{ borderRadius: '5px' }}>
                  <form onSubmit={handleAddToMeal}>
                    <div className="form-group">
                      <label>Meal Type</label>
                      <select className="form-control" value={mealType} onChange={(e) => setMealType(e.target.value)} required>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                        <option value="Snacks">Snacks</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Servings ({food.servingSize} {food.servingUnit} per serving)</label>
                      <input type="number" className="form-control" value={servings} onChange={(e) => setServings(e.target.value)} min="0.1" step="0.1" required />
                    </div>
                    <button type="submit" className="btn btn-block" disabled={logging}>
                      {logging ? 'Adding...' : 'Confirm Add to Meal'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodSearch;
