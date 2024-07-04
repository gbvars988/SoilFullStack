/**
 * This unit test verifies that the review submission form correctly enforces
 * the word limit restriction. It checks that when a review
 * with more than 100 words is entered, an error message is correctly displayed.
 *
 * The test mocks necessary dependencies, inputs a review of 101 words,
 * and ensures the error message "Review cannot exceed 100 words." is shown,
 * confirming the validation logic in review posts.
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductPage from "./productpage.js";
import { getProductById, getReviewsByProduct } from "../../Data/repository";
import { useUser } from "../../Context/UserContext";
import { useCart } from "../../Pages/Cart/useCart";

// Mock the necessary hooks and modules
jest.mock("../../Data/repository");
jest.mock("../../Context/UserContext");
jest.mock("../../Pages/Cart/useCart");

// Create mock objects for ProductPage
const mockUser = { username: "testuser" };
const mockProduct = {
  name: "Test Product",
  description: "Test Description",
  price: 10.0,
};
const mockReviews = { reviews: [], totalPages: 1, currentPage: 1 };

// Tells Jest to return mock objects when test renders ProductPage
beforeEach(() => {
  useUser.mockReturnValue({ user: mockUser });
  useCart.mockReturnValue({ addToCart: jest.fn() });
  getProductById.mockResolvedValue(mockProduct);
  getReviewsByProduct.mockResolvedValue(mockReviews);
});

test("Does not submit the review when the word count exceeds 100 words", async () => {
  render(<ProductPage />);

  // Wait for product to load
  await screen.findByText("Test Product");

  // Type a review with more than 100 words
  const reviewText = "word ".repeat(101).trim();
  const reviewInput = document.querySelector(".ql-editor"); // Need to directly access element of quill editor

  // Verify correct input element is retrieved and log the initial value of the review input
  console.log("Review input element: ", reviewInput);
  console.log("Initial review input value:", reviewInput.innerHTML);

  fireEvent.change(reviewInput, { target: { innerHTML: reviewText } });

  // Log the value of the review input after change
  console.log("Review input value after change:", reviewInput.innerHTML);

  // Attempt to submit the review
  const submitButton = screen.getByText("Submit Review");
  fireEvent.click(submitButton);

  // Check for the error message
  const errorMessage = await screen.findByText(
    "Review cannot exceed 100 words."
  );
  expect(errorMessage).toBeInTheDocument();
});
