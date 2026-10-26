import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import FoodCard from '../components/FoodCard';

const CATEGORIES = ['All', 'Burgers', 'Pizza', 'Chinese', 'Indian', 'Drinks', 'Desserts'];

const Menu = () => {
  const [foods, setFoods]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  // read ?category=Pizza from URL (set by Home page links)
  const categoryFromURL = searchParams.get('category') || 'All';
  const [activeCategory, setActiveCategory] = useState(categoryFromURL);

  // fetch foods whenever category changes
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const url = activeCategory === 'All'
          ? 'http://localhost:5000/api/foods'
          : `http://localhost:5000/api/foods?category=${activeCategory}`;
        const res = await axios.get(url);
        setFoods(res.data);
        setError('');
      } catch (err) {
        setError('Failed to load menu. Make sure server is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, [activeCategory]);

  const handleCategory = (cat) => {
    setActiveCategory(cat);
    cat === 'All'
      ? setSearchParams({})
      : setSearchParams({ category: cat });
  };

  return (
    <div className="menu-page">
      <h1>Our Menu</h1>

      {/* Category Filter Tabs */}
      <div className="category-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`tab-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => handleCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* States */}
      {loading && <div className="status-msg">Loading menu...</div>}
      {error   && <div className="status-msg error">{error}</div>}

      {/* Food Grid */}
      {!loading && !error && (
        <>
          <p className="result-count">{foods.length} items found</p>
          <div className="food-grid">
            {foods.map(food => (
              <FoodCard key={food._id} food={food} />
            ))}
          </div>
          {foods.length === 0 && (
            <div className="status-msg">No items in this category.</div>
          )}
        </>
      )}
    </div>
  );
};

export default Menu;