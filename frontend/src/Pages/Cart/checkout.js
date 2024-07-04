import { React, useState } from "react";
import { useCart } from "./useCart";
import { useNavigate } from "react-router-dom";
import "./checkout.css";

/**
 * CheckoutForm component handles the checkout process, including payment details
 * input, validation, and clearing the cart upon successful purchase.
 *
 * @component
 */

function CheckoutForm() {
  const { cart, clearCart, calculateTotal } = useCart();
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handlePurchase = (e) => {
    e.preventDefault();
    const [month, year] = expiry.split("/").map(Number);
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      setErrorMessage(
        "Expiry date is in the past. Please enter a valid expiry date."
      );
      return;
    }

    clearCart();
    navigate("/purchasesummary", { state: { cart } });
  };

  const handleBackToCart = () => {
    navigate("/cart");
  };

  return (
    <div className="checkout-bg">
      <div className="checkout-container">
        <h1>Checkout</h1>
        <p>Subtotal: ${calculateTotal().toFixed(2)}</p>
        <button className="back-button" onClick={handleBackToCart}>
          Back to Cart
        </button>

        <div className="checkout-form">
          <h2>Enter your payment details</h2>
          <form onSubmit={handlePurchase}>
            <input
              type="text"
              className="card-form"
              placeholder="Credit Card Number (16 digits)"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              pattern="\d{16}"
              required
            />
            <input
              type="text"
              className="card-form"
              placeholder="Expiry Date (MM/YY)"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              pattern="(0[1-9]|1[0-2])/[0-9]{2}"
              required
            />
            <button type="submit">Complete Purchase</button>
          </form>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
}

export default CheckoutForm;
