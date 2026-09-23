import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FaUtensils, FaSearch, FaHistory, FaUserCog, FaExclamationTriangle, FaTint, FaWeight, FaChartLine, FaLightbulb } from 'react-icons/fa';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/dashboard');
      setSummary(res.data);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-center p-5 text-light">Loading dashboard...</div>;
  if (error) return <div className="card p-4 text-center text-danger bg-dark">{error}</div>;
  if (!summary || !summary.user) return null;

  const { user, goals, consumed, remainingCalories, isOverTarget, meals, water } = summary;

  // Group meals
  const groupedMeals = { Breakfast: [], Lunch: [], Dinner: [], Snacks: [] };
  meals.forEach(m => {
    const type = m.mealType === 'Snack' ? 'Snacks' : m.mealType;
    if (groupedMeals[type]) groupedMeals[type].push(m);
  });

  const calculateWidth = (val, target) => {
    if (!target || target === 0) return 0;
    const percentage = (val / target) * 100;
    return percentage > 100 ? 100 : percentage;
  };

  // BMI Calculation
  let bmiValue = null;
  let bmiCategory = '';
  let bmiColor = '';
  
  if (user.height && user.weight && user.height > 0 && user.weight > 0) {
    const heightInMeters = user.height / 100;
    const bmi = user.weight / (heightInMeters * heightInMeters);
    bmiValue = bmi.toFixed(2);
    
    if (bmi < 18.5) { bmiCategory = 'Underweight'; bmiColor = '#ff9800'; }
    else if (bmi >= 18.5 && bmi <= 24.9) { bmiCategory = 'Normal'; bmiColor = '#4caf50'; }
    else if (bmi >= 25 && bmi <= 29.9) { bmiCategory = 'Overweight'; bmiColor = '#ff9800'; }
    else { bmiCategory = 'Obesity'; bmiColor = '#f44336'; }
  }

  // Water target logic (legacy vs new metric)
  // If user has a water goal > 20, assume they set it in ml (e.g. 2000). Else assume default 2000ml.
  const waterTarget = (goals && goals.water > 20) ? goals.water : 2000;

  return (
    <div>
      {/* HEADER */}
      <div className="flex-between mb-3">
        <div>
          <h1 className="mb-1">Welcome, {user.name} 👋</h1>
          <p className="text-light m-0">
            {user.fitnessGoal} • {user.weight} kg
          </p>
        </div>
        {!goals && (
          <Link to="/profile" className="btn btn-sm" style={{ backgroundColor: 'var(--accent)' }}>
            <FaExclamationTriangle /> Set Nutrition Goals
          </Link>
        )}
      </div>

      {/* CALORIE CARD */}
      <div className="card mb-4 text-center" style={{ padding: '2rem' }}>
        <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div>
            <h3 className="text-light mb-1">Consumed</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{consumed.calories}</div>
            <div className="text-light">kcal</div>
          </div>
          <div style={{ borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
            <h3 className="text-light mb-1">Target</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{user.calorieGoal}</div>
            <div className="text-light">kcal</div>
          </div>
          <div>
            <h3 className="text-light mb-1">Remaining</h3>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: isOverTarget ? 'var(--danger)' : 'var(--success)' }}>
              {remainingCalories}
            </div>
            <div className="text-light">{isOverTarget ? 'over target' : 'kcal'}</div>
          </div>
        </div>
        
        <div className="progress-bar-container mt-4" style={{ height: '15px' }}>
          <div 
            className="progress-bar-fill" 
            style={{ width: `${calculateWidth(consumed.calories, user.calorieGoal)}%`, backgroundColor: isOverTarget ? 'var(--danger)' : 'var(--primary)' }}
          ></div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div>
          {/* MACROS */}
          <div className="card mb-4">
            <h2 className="mb-3">Macronutrients</h2>
            <div className="mb-3">
              <div className="flex-between text-light mb-1"><span>Protein</span><span>{consumed.protein}g / {goals ? `${goals.protein}g` : '-'}</span></div>
              <div className="progress-bar-container" style={{ height: '8px' }}><div className="progress-bar-fill" style={{ width: `${calculateWidth(consumed.protein, goals?.protein)}%`, backgroundColor: '#e91e63' }}></div></div>
            </div>
            <div className="mb-3">
              <div className="flex-between text-light mb-1"><span>Carbohydrates</span><span>{consumed.carbs}g / {goals ? `${goals.carbs}g` : '-'}</span></div>
              <div className="progress-bar-container" style={{ height: '8px' }}><div className="progress-bar-fill" style={{ width: `${calculateWidth(consumed.carbs, goals?.carbs)}%`, backgroundColor: '#ff9800' }}></div></div>
            </div>
            <div className="mb-3">
              <div className="flex-between text-light mb-1"><span>Fats</span><span>{consumed.fat}g / {goals ? `${goals.fat}g` : '-'}</span></div>
              <div className="progress-bar-container" style={{ height: '8px' }}><div className="progress-bar-fill" style={{ width: `${calculateWidth(consumed.fat, goals?.fat)}%`, backgroundColor: '#4caf50' }}></div></div>
            </div>
          </div>

          {/* MEALS */}
          <div className="flex-between mb-2">
            <h2>Today's Meals</h2>
            <Link to="/meals" className="btn btn-sm">Manage</Link>
          </div>
          {meals.length === 0 ? (
             <div className="card text-center p-4">
               <p className="text-light mb-3">No meals logged today.</p>
               <Link to="/food-search" className="btn btn-sm"><FaSearch /> Search Food</Link>
             </div>
          ) : (
            ['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map(mealType => (
              <div key={mealType} className="mb-3">
                <h3 className="mb-2" style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>{mealType}</h3>
                {groupedMeals[mealType].length === 0 ? (
                  <p className="text-light" style={{ fontSize: '0.85rem' }}>Nothing logged.</p>
                ) : (
                  <div className="food-list">
                    {groupedMeals[mealType].map(food => (
                      <div key={food._id} className="card p-2 mb-2 flex-between bg-dark">
                        <div>
                          <strong style={{ fontSize: '0.9rem' }}>{food.name}</strong>
                          <div className="text-light" style={{ fontSize: '0.75rem' }}>{food.quantity}</div>
                        </div>
                        <div className="text-right">
                          <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{food.calories} kcal</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* SIDEBAR WIDGETS */}
        <div>
          {/* WATER SUMMARY CARD */}
          <div className="card mb-3 text-center">
            <h3><FaTint color="#2196f3" /> Water</h3>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{water} / {waterTarget} ml</div>
            <div className="progress-bar-container" style={{ height: '10px', marginBottom: '1rem' }}>
              <div className="progress-bar-fill" style={{ width: `${calculateWidth(water, waterTarget)}%`, backgroundColor: '#2196f3' }}></div>
            </div>
            <Link to="/water" className="btn btn-sm btn-block" style={{ backgroundColor: '#2196f3' }}>Log Water</Link>
          </div>

          {/* WEIGHT & BMI CARD */}
          <div className="card mb-3 text-center">
            <h3><FaWeight color="var(--accent)" /> Weight & BMI</h3>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{user.weight} kg</div>
            
            {bmiValue ? (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>Current BMI</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{bmiValue}</div>
                <div style={{ color: bmiColor, fontWeight: 'bold' }}>{bmiCategory}</div>
              </div>
            ) : (
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                BMI unavailable. Add height in profile.
              </div>
            )}
            <Link to="/weight" className="btn btn-sm btn-block mt-3" style={{ backgroundColor: 'var(--accent)' }}>Track Weight</Link>
          </div>
          
          <div className="card mt-3">
            <h3 className="mb-3">Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/food-search" className="btn btn-block" style={{ textAlign: 'left' }}><FaSearch /> Log New Food</Link>
              <Link to="/food-suggestions" className="btn btn-block" style={{ textAlign: 'left', backgroundColor: '#ffeb3b', color: '#000' }}><FaLightbulb /> Food Suggestions</Link>
              <Link to="/meals" className="btn btn-block" style={{ textAlign: 'left', backgroundColor: '#9c27b0' }}><FaUtensils /> Manage Meals</Link>
              <Link to="/progress" className="btn btn-block" style={{ textAlign: 'left', backgroundColor: '#4caf50' }}><FaChartLine /> View Progress</Link>
              <Link to="/history" className="btn btn-block" style={{ textAlign: 'left', backgroundColor: '#2196f3' }}><FaHistory /> View History</Link>
              <Link to="/profile" className="btn btn-block" style={{ textAlign: 'left', backgroundColor: '#607d8b' }}><FaUserCog /> Edit Profile</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
