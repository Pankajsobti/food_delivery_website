import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const STATUS_STEPS = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];

const OrderSuccess = () => {
  const { id }         = useParams();
  const { token }      = useAuth();
  const [order, setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/orders/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrder(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, token]);

  if (loading) return <div className="status-msg">Loading order details...</div>;
  if (!order)  return <div className="status-msg error">Order not found.</div>;

  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="success-page">

      {/* Success Banner */}
      <div className="success-banner">
        <div className="success-icon">🎉</div>
        <h1>Order Placed Successfully!</h1>
        <p>Order ID: <strong>#{order._id.slice(-8).toUpperCase()}</strong></p>
        <p>Estimated delivery time: <strong>30–45 minutes</strong></p>
      </div>

      {/* Status Tracker */}
      <div className="status-tracker-card">
        <h2>Order Status</h2>
        <div className="status-steps">
          {STATUS_STEPS.map((step, index) => (
            <div key={step} className="status-step-wrapper">
              <div className={`status-step ${index <= currentStep ? 'done' : ''} ${index === currentStep ? 'active' : ''}`}>
                <div className="step-circle">
                  {index < currentStep  ? '✓' : index + 1}
                </div>
                <span className="step-label">{step}</span>
              </div>
              {index < STATUS_STEPS.length - 1 && (
                <div className={`step-line ${index < currentStep ? 'done' : ''}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Order Details */}
      <div className="order-detail-card">
        <h2>Order Details</h2>
        <div className="order-detail-items">
          {order.items.map((item, i) => (
            <div key={i} className="order-detail-item">
              <span className="od-name">{item.name}</span>
              <span className="od-qty">x{item.quantity}</span>
              <span className="od-price">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <div className="order-detail-footer">
          <div className="summary-row">
            <span>Payment Method</span>
            <span>{order.paymentMethod}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Address</span>
            <span>{order.deliveryAddress}</span>
          </div>
          <div className="summary-row total">
            <span>Total Paid</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>
      </div>

      <div className="success-actions">
        <Link to="/orders"  className="hero-btn">View All Orders</Link>
        <Link to="/menu" className="secondary-btn">Order More Food</Link>
      </div>

    </div>
  );
};

export default OrderSuccess;