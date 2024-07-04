/**
 * This file contains unit tests for cart-related operations including:
 * 1. Ensuring the quantity selector correctly updates the quantity of a product in the cart and calls
 *    the updateQuantity function in userCart.js
 * 2. Ensures clicking 'Remove' button correctly calls removeItem function in useCart.js
 * 3. Ensures clicking 'Clear Cart' button correctly calls clearCart function in useCart.js
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Cart from "./cart.js";
import { useCart } from "./useCart";
import { BrowserRouter as Router } from "react-router-dom";

// Mock the useCart hook
jest.mock("./useCart");

// Create a mock useCart return object which will be used when Cart component is rendered
const mockCart = {
  cart: {
    1: { product_id: 1, name: "Product 1", quantity: 1, price: 10 },
    2: { product_id: 2, name: "Product 2", quantity: 2, price: 20 },
  },
  addToCart: jest.fn(),
  removeItem: jest.fn(),
  increaseQuantity: jest.fn(),
  decreaseQuantity: jest.fn(),
  updateQuantity: jest.fn(),
  clearCart: jest.fn(),
  calculateTotal: () => 30,
  getItemCount: () => 2,
};

// Tells Jest to return the mockCart object whenever useCart hook is required by Cart component.
beforeEach(() => {
  useCart.mockReturnValue(mockCart);
});

test("Updates product quantity in the cart", () => {
  render(
    <Router>
      <Cart />
    </Router>
  );

  // Find the quantity input for the first product
  const quantityInput = screen.getAllByRole("spinbutton")[0];

  // Change the quantity to 3
  fireEvent.change(quantityInput, { target: { value: "3" } });

  // Simulate blur event to trigger update
  fireEvent.blur(quantityInput);

  // Ensure the updateQuantity function is called with correct arguments
  expect(mockCart.updateQuantity).toHaveBeenCalledWith(1, 3);
});

test("Removes a product from the cart", () => {
  render(
    <Router>
      <Cart />
    </Router>
  );

  // Find the remove button for the first product
  const removeButton = screen.getAllByText("Remove")[0];

  // Click the remove button
  fireEvent.click(removeButton);

  // Ensure the removeItem function is called with correct arguments
  expect(mockCart.removeItem).toHaveBeenCalledWith(1);
});

test("Clears the cart when the clear cart button is clicked", () => {
  render(
    <Router>
      <Cart />
    </Router>
  );

  // Find the clear cart button
  const clearCartButton = screen.getByText("Clear Cart");

  // Click the clear cart button
  fireEvent.click(clearCartButton);

  // Ensure the clearCart function is called
  expect(mockCart.clearCart).toHaveBeenCalled();
});
