const ProgressBar = ({ current, target }) => {
  // Calculate percentage (cap at 100% for the bar width)
  const percentage = Math.min((current / target) * 100, 100);
  const isExceeded = current > target;

  return (
    <div>
      <div className="flex-between mb-1">
        <span>Consumed: <strong>{current} kcal</strong></span>
        <span>Goal: <strong>{target} kcal</strong></span>
      </div>
      
      <div className="progress-container">
        <div 
          className={`progress-fill ${isExceeded ? 'exceeded' : ''}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <div className="text-center mt-2">
        {isExceeded ? (
          <span className="text-danger">You have exceeded your goal by {current - target} kcal!</span>
        ) : (
          <span className="text-success">{target - current} kcal remaining today.</span>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
