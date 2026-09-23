const FoodList = ({ foods, onDeleteFood }) => {
  if (!foods || foods.length === 0) {
    return (
      <div className="card text-center">
        <p>No meals added.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Food Entries</h2>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Food</th>
              <th>Meal</th>
              <th>Quantity</th>
              <th>Calories</th>
              <th>P / C / F (g)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food) => (
              <tr key={food._id}>
                <td>{food.foodName}</td>
                <td>{food.mealType}</td>
                <td>{food.quantity}</td>
                <td>{food.calories} kcal</td>
                <td>{food.protein} / {food.carbohydrates} / {food.fat}</td>
                <td>
                  <button 
                    className="btn btn-danger btn-sm" 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this food entry?')) {
                        onDeleteFood(food._id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FoodList;
