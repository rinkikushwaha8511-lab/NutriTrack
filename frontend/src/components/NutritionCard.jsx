const NutritionCard = ({ title, value, unit }) => {
  return (
    <div className="card nutrition-card">
      <h3>{title}</h3>
      <div className="nutrition-value">
        {value} <span style={{ fontSize: '1rem', color: '#666' }}>{unit}</span>
      </div>
    </div>
  );
};

export default NutritionCard;
