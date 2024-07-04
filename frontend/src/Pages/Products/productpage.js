/**
 * @fileoverview ProductPage component that displays product details, allows users to add products to the cart,
 * and provides functionality for adding, editing, deleting, and replying to reviews. It also handles following/unfollowing users.
 */

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getProductById,
  getReviewsByProduct,
  addReview,
  updateReview,
  deleteReview,
  followUser,
  unfollowUser,
  getFollowingUsers,
} from "../../Data/repository.js";
import { useUser } from "../../Context/UserContext";
import { useCart } from "../../Pages/Cart/useCart";
import "./productpage.css";
import sanitizeHtml from "sanitize-html";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ReactStars from "react-stars";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

/**
 * ProductPage component.
 * @returns {JSX.Element}
 */
const ProductPage = () => {
  const { productId } = useParams();
  const { user } = useUser();
  const { addToCart } = useCart();
  const [product, setProduct] = useState({});
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [newStars, setNewStars] = useState(1);
  const [replyContent, setReplyContent] = useState("");
  const [replyReviewId, setReplyReviewId] = useState(null);
  const [editReviewId, setEditReviewId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editStars, setEditStars] = useState(1);
  const [following, setFollowing] = useState({});
  const [wordCount, setWordCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProductById(productId);
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchReviews = async (page = 1) => {
      try {
        const reviewsData = await getReviewsByProduct(productId, page);
        const initializedReviews = reviewsData.reviews.map((review) => ({
          ...review,
          replies: review.replies ? review.replies : [],
        }));
        setReviews(initializedReviews);
        setTotalPages(reviewsData.totalPages);
        setCurrentPage(reviewsData.currentPage);
      } catch (error) {
        console.error("Error fetching reviews;", error);
      }
    };

    const fetchFollowing = async () => {
      if (user && user.username) {
        try {
          const followingData = await getFollowingUsers(user.username);
          console.log("Following data from backend: ", followingData);
          const followingMap = followingData.reduce((acc, curr) => {
            acc[curr] = true;
            return acc;
          }, {});
          console.log("Following map: ", followingMap);
          setFollowing(followingMap);
        } catch (error) {
          console.error("Error fetching following users:", error);
        }
      }
    };

    fetchProduct();
    fetchReviews(currentPage);
    fetchFollowing();
  }, [productId, currentPage]);

  /**
   * Handles adding a new review.
   */
  const handleAddReview = async () => {
    if (wordCount > 100) {
      setErrorMessage("Review cannot exceed 100 words.");
      return;
    }
    try {
      const sanitizedContent = sanitizeHtml(newReview);
      const reviewData = {
        content: sanitizedContent,
        stars: newStars,
        product_id: productId,
        username: user.username,
        parent_review_id: null,
      };
      console.log(reviewData);
      const createdReview = await addReview(reviewData);
      setReviews([...reviews, { ...createdReview, replies: [] }]);
      setNewReview("");
      setNewStars(1);
      setWordCount(0);
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  /**
   * Handles updating an existing review.
   * @param {number} reviewId - The id of the review to update.
   * @param {string} updatedContent - The updated content of the review.
   * @param {number} updatedStars - The updated star rating of the review.
   */
  const handleUpdateReview = async (reviewId, updatedContent, updatedStars) => {
    const words = updatedContent.split(/\s+/);
    if (words.length > 100) {
      setErrorMessage("Review cannot exceed 100 words.");
      return;
    }
    try {
      const sanitizedContent = sanitizeHtml(updatedContent);
      const updatedReview = await updateReview(reviewId, {
        content: sanitizedContent,
        stars: updatedStars,
      });
      setReviews(
        reviews.map((review) =>
          review.review_id === reviewId ? updatedReview : review
        )
      );
      setEditReviewId(null);
    } catch (error) {
      console.error("Error updating review: ", error);
    }
  };

  /**
   * Sets the state for editing a review.
   * @param {object} review - The review object to edit.
   */
  const handleEditReview = (review) => {
    setEditReviewId(review.review_id);
    setEditContent(review.content);
    setEditStars(review.stars);
  };

  /**
   * Handles adding a reply to a review.
   * @param {number} parentReviewId - The id of the review to reply to.
   */
  const handleAddReply = async (parentReviewId) => {
    const words = replyContent.split(/\s+/);
    if (words.length > 100) {
      setErrorMessage("Reply cannot exceed 100 words.");
      return;
    }
    try {
      console.log("Adding reply to review ID:", parentReviewId);
      const sanitizedContent = sanitizeHtml(replyContent);
      const reply = {
        content: sanitizedContent,
        stars: null,
        product_id: productId,
        username: user.username,
        parent_review_id: parentReviewId,
      };

      const createdReply = await addReview(reply);
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.review_id === parentReviewId
            ? { ...review, replies: [...review.replies, createdReply] }
            : review
        )
      );
      setReplyContent("");
      setReplyReviewId(null);
    } catch (error) {
      console.error("Error adding reply", error);
    }
  };

  /**
   * Deletes a review.
   * @param {number} reviewId - The id of the review to delete.
   */
  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setReviews(reviews.filter((review) => review.review_id !== reviewId));
    } catch (error) {
      console.error("Error while deleting review: ", error);
    }
  };

  /**
   * Handles following a user.
   * @param {string} followed - The username of the user to follow.
   */
  const handleFollowUser = async (followed) => {
    try {
      // Change state before API request for optimised UI.
      setFollowing((prevFollowing) => ({
        ...prevFollowing,
        [followed]: true,
      }));
      await followUser(followed, user.username);
    } catch (error) {
      console.error("Error following user: ", error);
      // Revert changes if request fails.
      setFollowing((prevFollowing) => ({
        ...prevFollowing,
        [followed]: false,
      }));
    }
  };

  /**
   * Handles unfollowing a user.
   * @param {string} followed - The username of the user to unfollow.
   */
  const handleUnfollowUser = async (followed) => {
    try {
      setFollowing((prevFollowing) => ({
        ...prevFollowing,
        [followed]: false,
      }));
      await unfollowUser(followed, user.username);
    } catch (error) {
      console.error("Error unfollowing user:", error);
      setFollowing((prevFollowing) => ({
        ...prevFollowing,
        [followed]: true,
      }));
    }
  };

  /**
   * Handles the content change for a review and updates word count.
   * @param {string} content - The content of the review.
   */
  const handleReviewChange = (content) => {
    console.log("handleReviewChange called with content:", content);
    const words = content.split(/\s+/);
    if (words.length > 100) {
      console.log("Setting error message due to word limit exceeded");
      setErrorMessage("Review cannot exceed 100 words.");
      setWordCount(words.length);
    } else {
      console.log("Content is within the limit, setting new review content");
      setErrorMessage("");
      setNewReview(content);
      setWordCount(words.length);
    }
  };

  /**
   * Handles adding a product to the cart and shows a success toast message.
   */
  const handleAddToCart = async () => {
    await addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  /**
   * Handles changing the current page for pagination.
   * @param {number} page - The page number to change to.
   */
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="product-page">
      <div className="product-details">
        <h1>{product.name}</h1>
        {productImages[product.name] && (
          <img src={productImages[product.name]} alt={product.name} />
        )}
        <p>{product.description}</p>
        <p>Price: ${product.price}</p>
        <div className="average-rating">
          <p>Average Rating:</p>
          <ReactStars
            count={5}
            value={product.averageRating || 0}
            size={24}
            color2={"#ffd700"}
            edit={false}
            half={false}
          />
        </div>
        <button className="add-to-cart-button" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>

      <h2>Reviews</h2>
      {reviews.map((review) => (
        <div key={review.review_id} className="review">
          {editReviewId === review.review_id ? (
            <div>
              <ReactQuill
                value={editContent}
                onChange={setEditContent}
                theme="snow"
              />
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <ReactStars
                count={5}
                value={editStars}
                size={24}
                color2={"#ffd700"}
                onChange={setEditStars}
                half={false}
              />
              <div className="review-buttons">
                <button
                  onClick={() =>
                    handleUpdateReview(review.review_id, editContent, editStars)
                  }
                >
                  Save
                </button>
                <button onClick={() => setEditReviewId(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <p dangerouslySetInnerHTML={{ __html: review.content }}></p>
              <ReactStars
                count={5}
                value={review.stars}
                size={24}
                color2={"#ffd700"}
                edit={false}
                half={false}
              />
              <p>
                By: <strong>{review.username}</strong>
              </p>
              {review.username === user.username && (
                <div className="review-buttons">
                  <button onClick={() => handleEditReview(review)}>Edit</button>
                  <button onClick={() => handleDeleteReview(review.review_id)}>
                    Delete
                  </button>
                </div>
              )}
              {review.username !== user.username && (
                <div className="follow-buttons">
                  {following[review.username] ? (
                    <button onClick={() => handleUnfollowUser(review.username)}>
                      Unfollow
                    </button>
                  ) : (
                    <button onClick={() => handleFollowUser(review.username)}>
                      {" "}
                      Follow
                    </button>
                  )}
                </div>
              )}
            </>
          )}
          <div className="replies">
            {review.replies &&
              review.replies.map((reply) => (
                <div key={reply.review_id} className="reply">
                  <p dangerouslySetInnerHTML={{ __html: reply.content }}></p>
                  <p>By: {reply.username}</p>
                </div>
              ))}
          </div>
          <div>
            {replyReviewId === review.review_id ? (
              <div>
                <ReactQuill
                  value={replyContent}
                  onChange={setReplyContent}
                  theme="snow"
                />
                {errorMessage && (
                  <p className="error-message">{errorMessage}</p>
                )}
                <div className="reply-buttons">
                  <button onClick={() => handleAddReply(review.review_id)}>
                    Submit Reply
                  </button>
                  <button onClick={() => setReplyReviewId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <button
                className="reply-button"
                onClick={() => setReplyReviewId(review.review_id)}
              >
                Reply
              </button>
            )}
          </div>
        </div>
      ))}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <h2>Leave a Review</h2>
      <ReactQuill
        value={newReview}
        onChange={handleReviewChange}
        theme="snow"
      />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <ReactStars
        count={5}
        value={newStars}
        size={24}
        color2={"#ffd700"}
        onChange={setNewStars}
        half={false}
      />
      <p className="word-count">Word count: {wordCount}/100</p>
      <button className="submit-review-button" onClick={handleAddReview}>
        Submit Review
      </button>
      <ToastContainer />
    </div>
  );
};

export default ProductPage;
