import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import OrderCard from '../components/OrderCard';

const OrderHistory = () => {
  const { user, token }         = useAuth();
  const navigate                = useNavigate();
  const [orders,  setOrders]    = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState('');
  const [filter,  setFilter]    = useState('All');

  const FILTERS = ['All', 'Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          'http://localhost:5000/api/orders/myorders',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(res.data);
      } catch (err) {
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, token, navigate]);

  // update order in list after cancel
  const handleCancel = (cancelledId) => {
    setOrders(prev =>
      prev.map(o => o._id === cancelledId ? { ...o, status: 'Cancelled' } : o)
    );
  };

  const filteredOrders = filter === 'All'
    ? orders
    : orders.filter(o => o.status === filter);

  if (loading) return <div className="status-msg">Loading your orders...</div>;
  if (error)   return <div className="status-msg error">{error}</div>;

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>My Orders</h1>
        <Link to="/menu" className="hero-btn">+ New Order</Link>
      </div>

      {/* Stats Row */}
      <div className="order-stats">
        {[
          { label: 'Total Orders',   value: orders.length,                             emoji: '📦' },
          { label: 'Delivered',      value: orders.filter(o=>o.status==='Delivered').length,   emoji: '✅' },
          { label: 'Active',         value: orders.filter(o=>['Pending','Preparing','Out for Delivery'].includes(o.status)).length, emoji: '🔄' },
          { label: 'Cancelled',      value: orders.filter(o=>o.status==='Cancelled').length,   emoji: '❌' },
        ].map(stat => (
          <div key={stat.label} className="stat-card">
            <span className="stat-emoji">{stat.emoji}</span>
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="category-tabs" style={{ marginBottom: '20px' }}>
        {FILTERS.map(f => (
          <button
            key={f}
            className={`tab-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-icon">📭</div>
          <h2>No orders found</h2>
          <p>
            {filter === 'All'
              ? "You haven't placed any orders yet."
              : `No ${filter} orders.`}
          </p>
          <Link to="/menu" className="hero-btn">Order Now</Link>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map(order => (
            <OrderCard
              key={order._id}
              order={order}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;