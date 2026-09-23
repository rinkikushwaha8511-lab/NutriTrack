import { useState } from 'react';

const FoodForm = ({ onAddFood }) => {
  const [formData, setFormData] = useState({
    foodName: '',
    mealType: 'Breakfast',
    quantity: '',
    calories: '',
    protein: '',
    carbohydrates: '',
    fat: '',
    date: new Date().toISOString().split('T')[0] // Default to today
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddFood(formData);
    // Reset form mostly, but keep date and mealType
    setFormData({
      ...formData,
      foodName: '',
      quantity: '',
      calories: '',
      protein: '',
      carbohydrates: '',
      fat: ''
    });
  };

  return (
    <div className="card">
      <h2>Add Food Entry</h2>
      <form onSubmit={handleSubmit}>
        <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="form-group">
            <label>Food Name</label>
            <input type="text" name="foodName" value={formData.foodName} onChange={handleChange} className="form-control" required />
          </div>
          <div className="form-group">
            <label>Meal Type</label>
            <select name="mealType" value={formData.mealType} onChange={handleChange} className="form-control" required>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snack">Snack</option>
            </select>
          </div>
        </div>

        <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="form-group">
            <label>Quantity (e.g., 1 bowl, 100g)</label>
            <input type="text" name="quantity" value={formData.quantity} onChange={handleChange} className="form-control" required />
          </div>
          <div className="form-group">
            <label>Calories (kcal)</label>
            <input type="number" name="calories" value={formData.calories} onChange={handleChange} className="form-control" required min="0" />
          </div>
        </div>

        <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
          <div className="form-group">
            <label>Protein (g)</label>
            <input type="number" name="protein" value={formData.protein} onChange={handleChange} className="form-control" required min="0" />
          </div>
          <div className="form-group">
            <label>Carbs (g)</label>
            <input type="number" name="carbohydrates" value={formData.carbohydrates} onChange={handleChange} className="form-control" required min="0" />
          </div>
          <div className="form-group">
            <label>Fat (g)</label>
            <input type="number" name="fat" value={formData.fat} onChange={handleChange} className="form-control" required min="0" />
          </div>
        </div>

        <div className="form-group">
            <label>Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="form-control" required />
        </div>

        <button type="submit" className="btn btn-block">Add Food</button>
      </form>
    </div>
  );
};

export default FoodForm;
