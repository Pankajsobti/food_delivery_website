import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const { cart, totalAmount, clearCart } = useCart();
  const { user, token }                  = useAuth();
  const navigate                         = useNavigate();

  const [form, setForm] = useState({
    fullName:    user?.name  || '',
    phone:       user?.phone || '',
    address:     '',
    city:        '',
    pincode:     '',
    payment:     'Cash on Delivery'
  });

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const deliveryFee  = 40;
  const grandTotal   = totalAmount + deliveryFee;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate
    if (!form.address || !form.city || !form.pincode) {
      setError('Please fill in all address fields.');
      return;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      setError('Please enter a valid 6-digit pincode.');
      return;
    }
    if (!user) {
      setError('Please login to place an order.');
      return;
    }

    try {
      setLoading(true);

      const fullAddress = `${form.address}, ${form.city} - ${form.pincode}`;

      const orderData = {
        items: cart.map(item => ({
          food:     item._id,
          name:     item.name,
          price:    item.price,
          quantity: item.quantity
        })),
        totalAmount:     grandTotal,
        deliveryAddress: fullAddress,
        paymentMethod:   form.payment
      };

      const res = await axios.post(
        'http://localhost:5000/api/orders',
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      clearCart();
      // redirect to order success with order id
      navigate(`/order-success/${res.data._id}`);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  // redirect if cart empty
  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add items before checking out.</p>
        <Link to="/menu" className="hero-btn">Browse Menu</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-layout">

        {/* LEFT — Delivery Form */}
        <div className="checkout-form-section">
          <div className="checkout-section-card">
            <h2>📍 Delivery Details</h2>
            <form onSubmit={handleSubmit} className="checkout-form">

              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="House no, Street name, Landmark"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Ludhiana"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="141001"
                    required
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="checkout-section-card payment-section">
                <h2>💳 Payment Method</h2>
                <div className="payment-options">
                  {['Cash on Delivery', 'Online'].map(method => (
                    <label
                      key={method}
                      className={`payment-option ${form.payment === method ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method}
                        checked={form.payment === method}
                        onChange={handleChange}
                      />
                      <span>{method === 'Cash on Delivery' ? '💵' : '💳'}</span>
                      {method}
                    </label>
                  ))}
                </div>
              </div>

              {error && <p className="auth-error">{error}</p>}

              <button
                type="submit"
                className="place-order-btn"
                disabled={loading}
              >
                {loading ? 'Placing Order...' : `Place Order • ₹${grandTotal}`}
              </button>

            </form>
          </div>
        </div>

        {/* RIGHT — Order Summary */}
        <div className="checkout-summary">
          <div className="checkout-section-card">
            <h2>🧾 Order Summary</h2>
            <div className="checkout-items">
              {cart.map(item => (
                <div key={item._id} className="checkout-item">
                  <img src={item.image} alt={item.name} />
                  <div className="checkout-item-info">
                    <p className="checkout-item-name">{item.name}</p>
                    <p className="checkout-item-qty">Qty: {item.quantity}</p>
                  </div>
                  <span className="checkout-item-price">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
            <div className="checkout-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="summary-row total">
                <span>Grand Total</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;