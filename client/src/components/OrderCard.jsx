import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const STATUS_STEPS = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];

const STATUS_COLORS = {
  'Pending':          { bg: '#fff8e1', color: '#f39c12' },
  'Preparing':        { bg: '#e8f4fd', color: '#2980b9' },
  'Out for Delivery': { bg: '#e8f8f0', color: '#27ae60' },
  'Delivered':        { bg: '#eafaf1', color: '#1e8449' },
  'Cancelled':        { bg: '#fdf0f0', color: '#e74c3c' }
};

const OrderCard = ({ order, onCancel }) => {
  const { token }         = useAuth();
  const [cancelling, setCancelling] = useState(false);

  const statusStyle  = STATUS_COLORS[order.status] || {};
  const currentStep  = STATUS_STEPS.indexOf(order.status);
  const orderDate    = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      setCancelling(true);
      await axios.patch(
        `http://localhost:5000/api/orders/${order._id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onCancel(order._id);  // update parent state
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel order.');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="order-card">

      {/* Order Header */}
      <div className="order-card-header">
        <div>
          <p className="order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
          <p className="order-date">{orderDate}</p>
        </div>
        <span
          className="order-status-badge"
          style={{ background: statusStyle.bg, color: statusStyle.color }}
        >
          {order.status}
        </span>
      </div>

      {/* Items */}
      <div className="order-card-items">
        {order.items.map((item, i) => (
          <div key={i} className="order-card-item">
            <span>{item.name}</span>
            <span className="item-qty-price">
              x{item.quantity} &nbsp;•&nbsp; ₹{item.price * item.quantity}
            </span>
          </div>
        ))}
      </div>

      {/* Status Progress Bar (only for active orders) */}
      {order.status !== 'Cancelled' && (
        <div className="mini-tracker">
          {STATUS_STEPS.map((step, index) => (
            <div key={step} className="mini-step-wrap">
              <div className={`mini-dot ${index <= currentStep ? 'done' : ''}`} />
              <span className={`mini-label ${index === currentStep ? 'active-label' : ''}`}>
                {step}
              </span>
              {index < STATUS_STEPS.length - 1 && (
                <div className={`mini-line ${index < currentStep ? 'done' : ''}`} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="order-card-footer">
        <div>
          <p className="order-address">📍 {order.deliveryAddress}</p>
          <p className="order-payment">💳 {order.paymentMethod}</p>
        </div>
        <div className="order-card-right">
          <p className="order-total">₹{order.totalAmount}</p>
          {order.status === 'Pending' && (
            <button
              className="cancel-btn"
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

export default OrderCard;