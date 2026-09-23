import { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { FaChartLine, FaWeight, FaFire, FaTint } from 'react-icons/fa';

const Progress = () => {
  const [range, setRange] = useState('7d');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProgress = async (selectedRange) => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/progress?range=${selectedRange}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load progress data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress(range);
  }, [range]);

  if (loading && !data) return <div className="text-center p-5 text-light">Loading progress...</div>;
  if (error) return <div className="card p-4 text-center text-danger bg-dark">{error}</div>;
  if (!data || !data.summary) return <div className="text-center p-5 text-light">No progress data available for this period.</div>;

  const { summary, weight, calories, macros, water } = data;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="flex-between mb-4">
        <h1><FaChartLine style={{ color: 'var(--accent)' }} /> Progress</h1>
        
        <select 
          className="btn" 
          style={{ backgroundColor: 'var(--bg-dark)', color: 'var(--text)', border: '1px solid var(--border)' }}
          value={range}
          onChange={(e) => setRange(e.target.value)}
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="3m">Last 3 Months</option>
        </select>
      </div>

      {/* SUMMARY CARDS */}
      <div className="dashboard-grid mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="card text-center bg-dark">
          <h3 className="mb-2"><FaWeight color="var(--accent)" /> Current Weight</h3>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{summary.currentWeight || 'N/A'} kg</div>
          {summary.weightChange !== null && (
            <div style={{ color: summary.weightChange <= 0 ? 'var(--success)' : 'var(--danger)', fontSize: '0.9rem' }}>
              {summary.weightChange > 0 ? '+' : ''}{summary.weightChange} kg this period
            </div>
          )}
        </div>
        <div className="card text-center bg-dark">
          <h3 className="mb-2">BMI</h3>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{summary.bmi || 'N/A'}</div>
          <div className="text-light">{summary.bmiCategory}</div>
        </div>
        <div className="card text-center bg-dark">
          <h3 className="mb-2"><FaFire color="#ff9800" /> Avg Calories</h3>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{summary.averageCalories || 0}</div>
          <div className="text-light">kcal / day</div>
        </div>
        <div className="card text-center bg-dark">
          <h3 className="mb-2"><FaTint color="#2196f3" /> Avg Water</h3>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{summary.averageWater || 0}</div>
          <div className="text-light">ml / day</div>
        </div>
      </div>

      {/* CHARTS */}
      
      {/* 1. WEIGHT CHART */}
      <div className="card mb-4">
        <h3 className="mb-3">Weight Progress (kg)</h3>
        {weight.length < 2 ? (
          <p className="text-light text-center p-3">Not enough weight data to display a trend.</p>
        ) : (
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={weight} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" stroke="var(--text-light)" tick={{ fontSize: 12 }} />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="var(--text-light)" />
                <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333' }} />
                <Line type="monotone" dataKey="weight" name="Weight (kg)" stroke="var(--accent)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* 2. CALORIES CHART */}
      <div className="card mb-4">
        <h3 className="mb-3">Daily Calories (kcal)</h3>
        {calories.length === 0 ? (
          <p className="text-light text-center p-3">No meals logged for this period.</p>
        ) : (
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={calories} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                <XAxis dataKey="date" stroke="var(--text-light)" tick={{ fontSize: 12 }} />
                <YAxis stroke="var(--text-light)" />
                <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333' }} />
                <Legend />
                <Bar dataKey="consumed" name="Consumed" fill="#ff9800" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" name="Target Goal" fill="#333" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* 3. MACROS CHART */}
      <div className="card mb-4">
        <h3 className="mb-3">Macronutrients (g)</h3>
        {macros.length === 0 ? (
          <p className="text-light text-center p-3">No meal data available.</p>
        ) : (
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={macros} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" stroke="var(--text-light)" tick={{ fontSize: 12 }} />
                <YAxis stroke="var(--text-light)" />
                <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333' }} />
                <Legend />
                <Line type="monotone" dataKey="protein" name="Protein" stroke="#e91e63" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="carbs" name="Carbs" stroke="#ff9800" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="fat" name="Fat" stroke="#4caf50" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* 4. WATER CHART */}
      <div className="card">
        <h3 className="mb-3">Water Intake (ml)</h3>
        {water.length === 0 ? (
          <p className="text-light text-center p-3">No water logged for this period.</p>
        ) : (
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={water} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                <XAxis dataKey="date" stroke="var(--text-light)" tick={{ fontSize: 12 }} />
                <YAxis stroke="var(--text-light)" />
                <Tooltip contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333' }} />
                <Legend />
                <Bar dataKey="consumed" name="Consumed" fill="#2196f3" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" name="Daily Goal" fill="#333" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default Progress;
