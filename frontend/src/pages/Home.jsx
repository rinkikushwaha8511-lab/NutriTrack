import { Link } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';
import { 
  FaUtensils, FaAppleAlt, FaTint, FaWeight, FaChartLine, FaLightbulb, FaCheckCircle 
} from 'react-icons/fa';

const Home = ({ user }) => {
  const features = [
    {
      icon: <FaUtensils size={28} color="var(--primary-color)" />,
      title: 'Meal Tracking',
      description: 'Easily log breakfast, lunch, dinner, and snacks with automatic calorie & macro calculations.'
    },
    {
      icon: <FaAppleAlt size={28} color="#4caf50" />,
      title: 'Food Database',
      description: 'Search hundreds of items with detailed nutritional breakdown for calories, protein, carbs, and fats.'
    },
    {
      icon: <FaTint size={28} color="#00bcd4" />,
      title: 'Water Tracking',
      description: 'Monitor daily water intake in milliliters to ensure optimal hydration throughout the day.'
    },
    {
      icon: <FaWeight size={28} color="#e91e63" />,
      title: 'Weight & BMI',
      description: 'Record body weight logs over time and instantly calculate your Body Mass Index (BMI).'
    },
    {
      icon: <FaChartLine size={28} color="#2196f3" />,
      title: 'Progress Charts',
      description: 'Interactive analytics and trends visualizing your calorie intake, macros, and weight milestones.'
    },
    {
      icon: <FaLightbulb size={28} color="#ff9800" />,
      title: 'Food Suggestions',
      description: 'Receive personalized food recommendations aligned with your fitness goals and dietary preferences.'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-light)' }}>
      <PublicHeader user={user} />

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: 'var(--white)',
        padding: '5rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--white)', marginBottom: '1.2rem', lineHeight: 1.2 }}>
            Track your nutrition. Build healthier habits.
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#94a3b8', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            NutriTrack simplifies diet management. Log meals, track daily calories and macronutrients, 
            monitor water intake, and stay accountable to your fitness goals.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {user ? (
              <Link to="/dashboard" className="btn" style={{ padding: '0.9rem 2.2rem', fontSize: '1.1rem', textDecoration: 'none' }}>
                Go to Your Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn" style={{ padding: '0.9rem 2.2rem', fontSize: '1.1rem', textDecoration: 'none' }}>
                  Get Started Free
                </Link>
                <Link to="/login" className="btn" style={{ 
                  padding: '0.9rem 2.2rem', 
                  fontSize: '1.1rem', 
                  textDecoration: 'none',
                  backgroundColor: 'transparent',
                  border: '2px solid var(--primary-color)',
                  color: 'var(--white)'
                }}>
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            Everything You Need For Your Health Journey
          </h2>
          <p style={{ color: 'var(--text-light)', fontSize: '1rem' }}>
            Comprehensive tools designed to make nutrition tracking simple, accurate, and actionable.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.8rem'
        }}>
          {features.map((feature, idx) => (
            <div key={idx} className="card" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '2rem',
              borderRadius: '12px',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}>
              <div style={{
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                padding: '12px',
                borderRadius: '12px',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                {feature.title}
              </h3>
              <p style={{ color: 'var(--text-light)', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ backgroundColor: 'var(--white)', padding: '4rem 2rem', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '2rem' }}>
            Why Choose NutriTrack?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <FaCheckCircle color="var(--primary-color)" size={22} style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: '1.05rem', display: 'block', marginBottom: '4px' }}>Real-time Macro Calculation</strong>
                <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Instant breakdown of calories, protein, carbs, fats, and fiber per meal.</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <FaCheckCircle color="var(--primary-color)" size={22} style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: '1.05rem', display: 'block', marginBottom: '4px' }}>Goal-Based Guidance</strong>
                <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Set daily targets and monitor progress with clear visual indicators.</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <FaCheckCircle color="var(--primary-color)" size={22} style={{ marginTop: '2px', flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: '1.05rem', display: 'block', marginBottom: '4px' }}>Complete Privacy & Security</strong>
                <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>JWT role-protected platform keeping your personal data secure.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default Home;
