import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">🍔 FoodDash</Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
        <Link to="/cart" className="cart-link">
          🛒 Cart
          {totalItems > 0 && (
            <span className="cart-badge">{totalItems}</span>
          )}
        </Link>

        {user ? (
          // Logged in — show name + logout
          <div className="user-menu">
            <Link to="/orders" className="orders-nav-link">My Orders</Link>
            <span className="user-greeting">👤 {user.name.split(' ')[0]}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          // Not logged in — show login/register
          <div className="auth-nav">
            <Link to="/login"    className="login-nav-btn">Login</Link>
            <Link to="/register" className="register-nav-btn">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;