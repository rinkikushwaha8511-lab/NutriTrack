import { useState, useEffect } from 'react';
import api from '../services/api';
import { FaLightbulb, FaPlus, FaCheckCircle, FaExclamationCircle, FaUserAlt, FaUtensils, FaFire, FaRunning, FaWeight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FoodSuggestions = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    
    // Meal Adding State
    const [selectedFood, setSelectedFood] = useState(null);
    const [mealType, setMealType] = useState('Breakfast');
    const [servings, setServings] = useState(1);
    const [adding, setAdding] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const res = await api.get('/food-suggestions');
                setData(res.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load personalized food suggestions.');
            } finally {
                setLoading(false);
            }
        };
        fetchSuggestions();
    }, []);

    const openAddModal = (food, defaultMeal = 'Breakfast', suggestedServings = 1) => {
        setSelectedFood(food);
        setMealType(defaultMeal);
        setServings(suggestedServings);
    };

    const handleAddToMeal = async (e) => {
        e.preventDefault();
        if (!selectedFood) return;

        try {
            setAdding(true);
            await api.post('/meals', {
                foodItemId: selectedFood._id,
                mealType,
                servings: parseFloat(servings) || 1
            });
            setSuccessMsg(`Added ${servings} serving(s) of ${selectedFood.name} to ${mealType}!`);
            setSelectedFood(null);
            setTimeout(() => setSuccessMsg(''), 3500);
        } catch (err) {
            console.error(err);
            setError('Failed to add meal.');
            setTimeout(() => setError(''), 3000);
        } finally {
            setAdding(false);
        }
    };

    if (loading) return <div className="text-center p-5 text-light">Loading personalized body metrics & meal suggestions...</div>;
    if (error) return <div className="card p-4 text-center text-danger bg-dark"><FaExclamationCircle /> {error}</div>;

    const userProfile = data?.userProfile || {};
    const mealPlan = data?.mealPlan || {};
    const recommendations = data?.recommendations || [];

    if (!recommendations.length && (!mealPlan || Object.keys(mealPlan).length === 0)) {
        return (
            <div className="card text-center p-5 bg-dark" style={{ maxWidth: '700px', margin: '40px auto' }}>
                <FaExclamationCircle size={40} color="var(--accent)" className="mb-3" />
                <h3>No Suggestions Available</h3>
                <p className="text-light mt-2">
                    Please complete your profile and nutrition goals to get personalized suggestions tailored to your body.
                </p>
                <div className="mt-4">
                    <Link to="/profile" className="btn mx-2">Update Profile & Body Stats</Link>
                </div>
            </div>
        );
    }

    const mealTabs = [
        { key: 'all', label: 'All Recommendations', icon: '✨' },
        { key: 'breakfast', label: 'Breakfast', icon: '🌅' },
        { key: 'lunch', label: 'Lunch', icon: '☀️' },
        { key: 'dinner', label: 'Dinner', icon: '🌙' },
        { key: 'snacks', label: 'Snacks', icon: '🍎' }
    ];

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '40px' }}>
            {/* Title Header */}
            <div className="mb-4 text-center">
                <h1><FaLightbulb style={{ color: '#ffeb3b', marginRight: '10px' }} /> Personalized Nutrition & Meal Plan</h1>
                <p className="text-light mt-2" style={{ fontSize: '1.05rem' }}>
                    Custom food suggestions tailored directly to your <strong>body metrics, BMR, TDEE,</strong> and <strong>{userProfile.fitnessGoal || data?.goal}</strong> goals.
                </p>
            </div>

            {/* Success Message Banner */}
            {successMsg && (
                <div className="card bg-dark text-center mb-4" style={{ borderLeft: '5px solid var(--success)', color: 'var(--success)', fontWeight: 'bold' }}>
                    <FaCheckCircle color="var(--success)" style={{ marginRight: '8px' }} /> {successMsg}
                </div>
            )}

            {/* Body Metrics Summary Bar */}
            <div className="card bg-dark mb-4 p-4" style={{ borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <h3 className="mb-3 flex-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                    <span><FaUserAlt style={{ color: 'var(--primary)', marginRight: '8px' }} /> Your Body Details & Metrics</span>
                    <Link to="/profile" style={{ fontSize: '0.85rem', textDecoration: 'none', color: 'var(--accent)' }}>Edit Profile →</Link>
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '15px' }}>
                    <div style={{ background: '#1e1e1e', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ color: '#888', fontSize: '0.8rem' }}><FaWeight /> Weight / Height</div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginTop: '4px' }}>
                            {userProfile.weight ? `${userProfile.weight} kg` : 'N/A'} / {userProfile.height ? `${userProfile.height} cm` : 'N/A'}
                        </div>
                    </div>

                    <div style={{ background: '#1e1e1e', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ color: '#888', fontSize: '0.8rem' }}>BMI & Status</div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginTop: '4px', color: '#4caf50' }}>
                            {userProfile.bmi ? `${userProfile.bmi}` : 'N/A'} <span style={{ fontSize: '0.8rem', color: '#ccc' }}>({userProfile.bmiCategory || 'Normal'})</span>
                        </div>
                    </div>

                    <div style={{ background: '#1e1e1e', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ color: '#888', fontSize: '0.8rem' }}><FaFire /> BMR (Basal Rate)</div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginTop: '4px', color: '#ff9800' }}>
                            {userProfile.bmr ? `${userProfile.bmr} kcal/day` : 'N/A'}
                        </div>
                    </div>

                    <div style={{ background: '#1e1e1e', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ color: '#888', fontSize: '0.8rem' }}><FaRunning /> TDEE (Burn Rate)</div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginTop: '4px', color: '#2196f3' }}>
                            {userProfile.tdee ? `${userProfile.tdee} kcal/day` : 'N/A'}
                        </div>
                    </div>

                    <div style={{ background: '#1e1e1e', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ color: '#888', fontSize: '0.8rem' }}><FaUtensils /> Target Daily Calories</div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginTop: '4px', color: '#e91e63' }}>
                            {userProfile.dailyCalorieGoal || 2000} kcal
                        </div>
                    </div>
                </div>

                {/* Macro Split Pills */}
                <div className="mt-3 flex-between flex-wrap" style={{ fontSize: '0.85rem', color: '#bbb', gap: '10px', background: '#161616', padding: '10px 15px', borderRadius: '8px' }}>
                    <div><strong>Fitness Goal:</strong> <span style={{ color: '#ffeb3b' }}>{userProfile.fitnessGoal || data?.goal}</span></div>
                    <div><strong>Diet Preference:</strong> <span style={{ color: '#4caf50' }}>{userProfile.dietaryPreference || data?.dietaryPreference}</span></div>
                    <div><strong>Target Protein:</strong> {userProfile.targetProtein || 60}g</div>
                    <div><strong>Target Carbs:</strong> {userProfile.targetCarbs || 250}g</div>
                    <div><strong>Target Fats:</strong> {userProfile.targetFats || 55}g</div>
                </div>
            </div>

            {/* Meal Filter Tabs */}
            <div className="flex-between mb-4 flex-wrap" style={{ gap: '10px' }}>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                    {mealTabs.map(tab => (
                        <button
                            key={tab.key}
                            className="btn btn-sm"
                            style={{
                                backgroundColor: activeTab === tab.key ? 'var(--primary)' : '#2a2a2a',
                                color: '#fff',
                                borderRadius: '20px',
                                padding: '8px 18px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                border: 'none',
                                fontWeight: activeTab === tab.key ? 'bold' : 'normal'
                            }}
                            onClick={() => setActiveTab(tab.key)}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Render Meal Categorized View */}
            {activeTab === 'all' ? (
                <>
                    {/* Meal Plan Sections (Breakfast, Lunch, Dinner, Snacks) */}
                    {['breakfast', 'lunch', 'dinner', 'snacks'].map((slotKey) => {
                        const slot = mealPlan[slotKey];
                        if (!slot || !slot.suggestions || slot.suggestions.length === 0) return null;

                        const slotTitles = {
                            breakfast: { name: 'Breakfast Recommendations', icon: '🌅', color: '#ff9800' },
                            lunch: { name: 'Lunch Recommendations', icon: '☀️', color: '#4caf50' },
                            dinner: { name: 'Dinner Recommendations', icon: '🌙', color: '#2196f3' },
                            snacks: { name: 'Snacks Recommendations', icon: '🍎', color: '#e91e63' }
                        };

                        const meta = slotTitles[slotKey];

                        return (
                            <div key={slotKey} className="mb-5">
                                <div className="flex-between mb-3" style={{ borderBottom: `2px solid ${meta.color}`, paddingBottom: '8px' }}>
                                    <h2 style={{ margin: 0, fontSize: '1.3rem' }}>
                                        {meta.icon} {meta.name}
                                    </h2>
                                    <span style={{ fontSize: '0.85rem', color: '#aaa', backgroundColor: '#1e1e1e', padding: '4px 12px', borderRadius: '15px' }}>
                                        Target ~{slot.targetCalories} kcal | {slot.targetProtein}g Protein
                                    </span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                                    {slot.suggestions.map((food, idx) => (
                                        <div key={food._id + slotKey} className="card bg-dark" style={{ borderTop: `4px solid ${meta.color}`, position: 'relative' }}>
                                            <div className="flex-between mb-2">
                                                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{food.name}</h3>
                                                <span className="badge" style={{ backgroundColor: '#333', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                                                    {food.category}
                                                </span>
                                            </div>

                                            <div className="mb-3" style={{ fontSize: '0.85rem', color: '#ccc', fontStyle: 'italic', minHeight: '38px' }}>
                                                "{food.reason}"
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem', marginBottom: '15px', background: '#181818', padding: '10px', borderRadius: '6px' }}>
                                                <div><strong>Calories:</strong> {food.calories} kcal</div>
                                                <div><strong>Protein:</strong> {food.protein}g</div>
                                                <div><strong>Carbs:</strong> {food.carbohydrates}g</div>
                                                <div><strong>Fats:</strong> {food.fats}g</div>
                                                <div><strong>Fiber:</strong> {food.fiber}g</div>
                                                <div><small>per {food.servingSize} {food.servingUnit}</small></div>
                                            </div>

                                            {selectedFood?._id === food._id && mealType === slotKey.charAt(0).toUpperCase() + slotKey.slice(1) ? (
                                                <form onSubmit={handleAddToMeal} className="mt-2 p-3" style={{ backgroundColor: '#1e1e1e', borderRadius: '8px' }}>
                                                    <div className="form-group mb-2">
                                                        <label style={{ fontSize: '0.8rem' }}>Meal Category</label>
                                                        <select className="form-control" value={mealType} onChange={(e) => setMealType(e.target.value)}>
                                                            <option value="Breakfast">Breakfast</option>
                                                            <option value="Lunch">Lunch</option>
                                                            <option value="Dinner">Dinner</option>
                                                            <option value="Snacks">Snacks</option>
                                                        </select>
                                                    </div>
                                                    <div className="form-group mb-3">
                                                        <label style={{ fontSize: '0.8rem' }}>Servings</label>
                                                        <input type="number" className="form-control" min="0.1" step="0.1" value={servings} onChange={(e) => setServings(e.target.value)} />
                                                    </div>
                                                    <div className="flex-between">
                                                        <button type="button" className="btn btn-sm" style={{ backgroundColor: '#555' }} onClick={() => setSelectedFood(null)}>Cancel</button>
                                                        <button type="submit" className="btn btn-sm btn-primary" disabled={adding}>
                                                            {adding ? 'Adding...' : 'Confirm'}
                                                        </button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <button 
                                                    className="btn btn-block mt-auto" 
                                                    style={{ backgroundColor: meta.color, color: '#fff', fontWeight: 'bold' }}
                                                    onClick={() => openAddModal(food, slotKey.charAt(0).toUpperCase() + slotKey.slice(1), food.recommendedServings || 1)}
                                                >
                                                    <FaPlus /> Add to {slotKey.charAt(0).toUpperCase() + slotKey.slice(1)}
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </>
            ) : (
                /* Filtered Meal Tab View */
                <div>
                    {(() => {
                        const slot = mealPlan[activeTab];
                        if (!slot || !slot.suggestions || slot.suggestions.length === 0) {
                            return <div className="card p-4 text-center bg-dark">No specific items found for this meal type.</div>;
                        }

                        const mealTitle = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);

                        return (
                            <div>
                                <h2 className="mb-3">{mealTitle} Recommended Items</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                                    {slot.suggestions.map((food) => (
                                        <div key={food._id + 'tab'} className="card bg-dark" style={{ borderTop: '4px solid var(--accent)' }}>
                                            <div className="flex-between mb-2">
                                                <h3 style={{ margin: 0 }}>{food.name}</h3>
                                                <span className="badge" style={{ backgroundColor: 'var(--primary)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                                                    {food.category}
                                                </span>
                                            </div>

                                            <div className="mb-3" style={{ fontSize: '0.85rem', color: '#ccc', fontStyle: 'italic', minHeight: '38px' }}>
                                                "{food.reason}"
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem', marginBottom: '15px', background: '#181818', padding: '10px', borderRadius: '6px' }}>
                                                <div><strong>Calories:</strong> {food.calories} kcal</div>
                                                <div><strong>Protein:</strong> {food.protein}g</div>
                                                <div><strong>Carbs:</strong> {food.carbohydrates}g</div>
                                                <div><strong>Fats:</strong> {food.fats}g</div>
                                                <div><strong>Fiber:</strong> {food.fiber}g</div>
                                                <div><small>per {food.servingSize} {food.servingUnit}</small></div>
                                            </div>

                                            {selectedFood?._id === food._id ? (
                                                <form onSubmit={handleAddToMeal} className="mt-2 p-3" style={{ backgroundColor: '#1e1e1e', borderRadius: '8px' }}>
                                                    <div className="form-group mb-2">
                                                        <label style={{ fontSize: '0.8rem' }}>Meal Category</label>
                                                        <select className="form-control" value={mealType} onChange={(e) => setMealType(e.target.value)}>
                                                            <option value="Breakfast">Breakfast</option>
                                                            <option value="Lunch">Lunch</option>
                                                            <option value="Dinner">Dinner</option>
                                                            <option value="Snacks">Snacks</option>
                                                        </select>
                                                    </div>
                                                    <div className="form-group mb-3">
                                                        <label style={{ fontSize: '0.8rem' }}>Servings</label>
                                                        <input type="number" className="form-control" min="0.1" step="0.1" value={servings} onChange={(e) => setServings(e.target.value)} />
                                                    </div>
                                                    <div className="flex-between">
                                                        <button type="button" className="btn btn-sm" style={{ backgroundColor: '#555' }} onClick={() => setSelectedFood(null)}>Cancel</button>
                                                        <button type="submit" className="btn btn-sm btn-primary" disabled={adding}>
                                                            {adding ? 'Adding...' : 'Confirm'}
                                                        </button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <button 
                                                    className="btn btn-block mt-auto" 
                                                    style={{ backgroundColor: 'var(--accent)', color: '#fff', fontWeight: 'bold' }}
                                                    onClick={() => openAddModal(food, mealTitle, food.recommendedServings || 1)}
                                                >
                                                    <FaPlus /> Add to {mealTitle}
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}
        </div>
    );
};

export default FoodSuggestions;
