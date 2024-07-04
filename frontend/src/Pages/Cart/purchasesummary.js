import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./purchasesummary.css";

/**
 * PurchaseSummary component displays the summary of a user's purchase, including
 * the list of items purchased, their quantities, and the total cost.
 *
 * @component
 */

function PurchaseSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { cart } = state || { cart: {} };

  const handleBackToProducts = () => {
    navigate("/products");
  };

  /**
   * Calculates the total cost of items in the cart.
   * @returns {number} - The total cost of the items in the cart.
   */
  const calculateTotal = () => {
    return Object.values(cart).reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  return (
    <div className="purchase-summary-bg">
      <div className="purchase-summary-container">
        <h1>Purchase Summary</h1>
        <p>Your purchase was successful!</p>
        <div className="purchase-summary-items">
          {Object.keys(cart).map((itemId) => (
            <div key={itemId} className="purchase-summary-item">
              <p>
                {cart[itemId].name} x {cart[itemId].quantity}
              </p>
              <p>${(cart[itemId].price * cart[itemId].quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="purchase-summary-total">
          <h2>Total: ${calculateTotal().toFixed(2)}</h2>
        </div>
        <button onClick={handleBackToProducts}>Back to Products</button>
      </div>
    </div>
  );
}

export default PurchaseSummary;
