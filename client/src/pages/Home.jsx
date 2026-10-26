import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home">

      {/* Hero Section */}
      <div className="hero">
        <div className="hero-text">
          <h1>Hungry? <br/> We've got you covered 🍕</h1>
          <p>Order delicious food from the best restaurants — delivered hot to your door.</p>
          <Link to="/menu" className="hero-btn">Browse Menu</Link>
        </div>
        <div className="hero-img">🍔</div>
      </div>

      {/* Categories Section */}
      <div className="categories-section">
        <h2>What are you craving?</h2>
        <div className="categories">
          {[
            { name: 'Burgers',  emoji: '🍔' },
            { name: 'Pizza',    emoji: '🍕' },
            { name: 'Chinese',  emoji: '🍜' },
            { name: 'Indian',   emoji: '🍛' },
            { name: 'Drinks',   emoji: '🥤' },
            { name: 'Desserts', emoji: '🍰' },
          ].map(cat => (
            <Link
              key={cat.name}
              to={`/menu?category=${cat.name}`}
              className="category-card"
            >
              <span className="cat-emoji">{cat.emoji}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="features">
        <div className="feature">
          <span>⚡</span>
          <h3>Fast Delivery</h3>
          <p>Get your food in 30 minutes or less</p>
        </div>
        <div className="feature">
          <span>🍽️</span>
          <h3>Fresh Food</h3>
          <p>Made fresh with quality ingredients</p>
        </div>
        <div className="feature">
          <span>💰</span>
          <h3>Best Prices</h3>
          <p>Great food at affordable prices</p>
        </div>
      </div>

    </div>
  );
};

export default Home;