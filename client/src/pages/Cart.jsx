import { useState } from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
// Add this import at the top
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, increaseQty, decreaseQty, clearCart, totalAmount } = useCart();
  const [address, setAddress]   = useState('');
  const [ordered, setOrdered]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const { user, token } = useAuth();
  const navigate = useNavigate();

const handlePlaceOrder = async () => {
  if (!user) {
    setError('Please login to place an order.');
    return;
  }
  if (!address.trim()) {
    setError('Please enter a delivery address.');
    return;
  }
  try {
    setLoading(true);
    const orderData = {
      items: cart.map(item => ({
        food:     item._id,
        name:     item.name,
        price:    item.price,
        quantity: item.quantity
      })),
      totalAmount,
      deliveryAddress:  address,
      paymentMethod:    'Cash on Delivery'
    };
    await axios.post('http://localhost:5000/api/orders', orderData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    clearCart();
    setOrdered(true);
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to place order.');
  } finally {
    setLoading(false);
  }
};

  // Order success screen
  if (ordered) {
    return (
      <div className="order-success">
        <div className="success-icon">🎉</div>
        <h2>Order Placed Successfully!</h2>
        <p>Your food is being prepared. Estimated delivery: 30 minutes.</p>
        <Link to="/menu" className="hero-btn">Order More Food</Link>
      </div>
    );
  }

  // Empty cart
  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add some delicious food from our menu!</p>
        <Link to="/menu" className="hero-btn">Browse Menu</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <div className="cart-layout">

        {/* Cart Items */}
        <div className="cart-items">
          {cart.map(item => (
            <div key={item._id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-img" />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>₹{item.price} each</p>
              </div>
              <div className="qty-controls">
                <button onClick={() => decreaseQty(item._id)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => increaseQty(item._id)}>+</button>
              </div>
              <div className="item-total">₹{item.price * item.quantity}</div>
              <button className="remove-btn" onClick={() => removeFromCart(item._id)}>✕</button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="order-summary">
  <h2>Order Summary</h2>
  <div className="summary-row">
    <span>Subtotal</span>
    <span>₹{totalAmount}</span>
  </div>
  <div className="summary-row">
    <span>Delivery Fee</span>
    <span>₹40</span>
  </div>
  <div className="summary-row total">
    <span>Total</span>
    <span>₹{totalAmount + 40}</span>
  </div>
  <button
    className="place-order-btn"
    style={{ marginTop: '20px' }}
    onClick={() => {
      if (!user) {
        navigate('/login');
      } else {
        navigate('/checkout');
      }
    }}
  >
    Proceed to Checkout →
  </button>
  <button className="clear-cart-btn" onClick={clearCart}>
    Clear Cart
  </button>
</div>

      </div>
    </div>
  );
};

export default Cart;