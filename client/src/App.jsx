import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider }  from './context/CartContext';
import { AuthProvider }  from './context/AuthContext';
import Navbar            from './components/Navbar';
import Home              from './pages/Home';
import Menu              from './pages/Menu';
import Cart              from './pages/Cart';
import Checkout          from './pages/Checkout';
import OrderSuccess      from './pages/OrderSuccess';
import OrderHistory      from './pages/OrderHistory';
import Login             from './pages/Login';
import Register          from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/"                    element={<Home />}          />
              <Route path="/menu"                element={<Menu />}          />
              <Route path="/cart"                element={<Cart />}          />
              <Route path="/checkout"            element={<Checkout />}      />
              <Route path="/order-success/:id"   element={<OrderSuccess />}  />
              <Route path="/orders"              element={<OrderHistory />}  />
              <Route path="/login"               element={<Login />}         />
              <Route path="/register"            element={<Register />}      />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;