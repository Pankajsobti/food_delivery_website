import { createContext, useContext, useReducer } from 'react';

// 1. Create context
const CartContext = createContext();

// 2. Reducer — handles all cart actions
const cartReducer = (state, action) => {
  switch (action.type) {

    case 'ADD_TO_CART': {
      const existing = state.find(item => item._id === action.payload._id);
      if (existing) {
        // item already in cart — increase quantity
        return state.map(item =>
          item._id === action.payload._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // new item — add with quantity 1
      return [...state, { ...action.payload, quantity: 1 }];
    }

    case 'REMOVE_FROM_CART':
      return state.filter(item => item._id !== action.payload);

    case 'INCREASE_QTY':
      return state.map(item =>
        item._id === action.payload
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

    case 'DECREASE_QTY':
      return state.map(item =>
        item._id === action.payload && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ).filter(item => item.quantity > 0);

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
};

// 3. Provider — wraps whole app
export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const addToCart     = (food)  => dispatch({ type: 'ADD_TO_CART',    payload: food });
  const removeFromCart= (id)    => dispatch({ type: 'REMOVE_FROM_CART',payload: id });
  const increaseQty   = (id)    => dispatch({ type: 'INCREASE_QTY',   payload: id });
  const decreaseQty   = (id)    => dispatch({ type: 'DECREASE_QTY',   payload: id });
  const clearCart     = ()      => dispatch({ type: 'CLEAR_CART' });

  const totalItems    = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount   = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart,
      increaseQty, decreaseQty, clearCart,
      totalItems, totalAmount
    }}>
      {children}
    </CartContext.Provider>
  );
};

// 4. Custom hook for easy access
export const useCart = () => useContext(CartContext);