import { useCart } from '../context/CartContext';

const FoodCard = ({ food }) => {
  const { addToCart, cart } = useCart();

  const inCart = cart.find(item => item._id === food._id);

  return (
    <div className="food-card">
      <img src={food.image} alt={food.name} className="food-img" />
      <div className="food-info">
        <h3 className="food-name">{food.name}</h3>
        <p className="food-desc">{food.description}</p>
        <div className="food-footer">
          <span className="food-price">₹{food.price}</span>
          <button
            className={`add-btn ${inCart ? 'added' : ''}`}
            onClick={() => addToCart(food)}
          >
            {inCart ? `✓ Added (${inCart.quantity})` : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;