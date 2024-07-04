import { React, useState } from "react";
import { Link } from "react-router-dom";
import "./cart.css";
import Apple from "../../Assets/apple.jpg";
import Banana from "../../Assets/banana.jpg";
import Pear from "../../Assets/pear.jpg";
import Strawberry from "../../Assets/strawberry.jpg";
import Grape from "../../Assets/grape.jpg";
import Kiwi from "../../Assets/kiwi.jpg";
import Orange from "../../Assets/orange.jpg";
import Pineapple from "../../Assets/pineapple.jpg";
import Watermelon from "../../Assets/watermelon.jpg";
import Steak from "../../Assets/steak.jpg";
import Lobster from "../../Assets/lobster.jpg";
import Caviar from "../../Assets/caviar.jpg";
import Truffle from "../../Assets/truffle.jpg";
import Oyster from "../../Assets/oyster.jpg";
import { useCart } from "./useCart";
import { useNavigate } from "react-router-dom";

/**
 * Cart component displays the shopping cart items, allows quantity adjustments,
 * item removal, and provides a checkout option.
 *
 * @component
 */

const Cart = () => {
  const {
    cart,
    calculateTotal,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    updateQuantity,
    removeItem,
  } = useCart();

  const productImages = {
    Apple: Apple,
    Banana: Banana,
    Pear: Pear,
    Strawberry: Strawberry,
    Grape: Grape,
    Kiwi: Kiwi,
    Orange: Orange,
    Pineapple: Pineapple,
    Watermelon: Watermelon,
    Steak: Steak,
    Lobster: Lobster,
    Caviar: Caviar,
    Truffle: Truffle,
    Oyster: Oyster,
  };
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  const handleCheckout = () => {
    if (calculateTotal() <= 0) {
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 2000);
      return;
    }
    navigate("/checkout");
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity === "") {
      updateQuantity(productId, 0);
    } else {
      const quantity = parseInt(newQuantity, 10);
      if (!isNaN(quantity)) {
        updateQuantity(productId, quantity);
      }
    }
  };

  return (
    <div className="cart-bg">
      <div className="cart-container">
        <h1>Shopping Cart</h1>
        <h2>Cart Items</h2>
        <div className="cart-items">
          {Object.keys(cart).length === 0 ? (
            <p>Cart is empty</p>
          ) : (
            Object.values(cart).map((item) => (
              <div key={item.product_id} className="cart-item">
                <div className="cart-item-content">
                  <div className="cart-item-details">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-quantity">
                      Quantity: {cart[item.product_id].quantity}
                      <input
                        type="number"
                        value={cart[item.product_id].quantity}
                        onChange={(e) =>
                          handleQuantityChange(item.product_id, e.target.value)
                        }
                      />
                      <button onClick={() => increaseQuantity(item.product_id)}>
                        +
                      </button>
                      <button onClick={() => decreaseQuantity(item.product_id)}>
                        -
                      </button>
                    </div>
                    <div className="cart-item-price">
                      Price: ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                  {productImages[item.name] && (
                    <img
                      src={productImages[item.name]}
                      alt={item.name}
                      className="cart-item-image"
                    />
                  )}
                </div>
                <button onClick={() => removeItem(item.product_id)}>
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
        <div className="cart-total">
          <h2>Total</h2>
          <p>${calculateTotal().toFixed(2)}</p>
        </div>
        <div className="cart-actions">
          <Link to="/products" className="cart-action-link">
            Back to Products
          </Link>
          <button className="clear-cart" onClick={clearCart}>
            Clear Cart
          </button>
          <button className="checkout-button" onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      </div>
      {showPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Please add items to the cart.</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
