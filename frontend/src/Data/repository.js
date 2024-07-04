/**
 * @file repository.js
 * @description Provides functions to interact with the backend API for various operations,
 * including user authentication, user management, cart operations, product retrieval,
 * review management, and follow/unfollow functionality. It also includes helper functions
 * to interact with local storage to cache user session.
 *
 * @module Repository
 */

import axios from "axios";

// --- Constants ----------------------------------------------------------------------------------
const API_HOST = "http://localhost:4000";
const USER_KEY = "user";

// --- User ---------------------------------------------------------------------------------------
async function verifyUser(username, password) {
  const response = await axios.get(API_HOST + "/api/users/login", {
    params: { username, password },
  });
  const user = response.data;

  if (user !== null) setUser(user);

  return user;
}

async function findUser(id) {
  const response = await axios.get(API_HOST + `/api/users/select/${id}`);

  return response.data;
}

async function findUserByEmail(email) {
  try {
    const response = await axios.get(`${API_HOST}/api/users/email/${email}`);
    return response.data;
  } catch (error) {
    console.error("Error finding user by email:", error);
    return null;
  }
}

async function createUser(user) {
  const response = await axios.post(API_HOST + "/api/users", user);

  return response.data;
}

async function getFollowingUsers(username) {
  const response = await axios.get(
    `${API_HOST}/api/users/following/${username}`
  );
  return response.data;
}

// --- Helper functions to interact with local storage --------------------------------------------
function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function getUser() {
  return JSON.parse(localStorage.getItem(USER_KEY));
}

function removeUser() {
  localStorage.removeItem(USER_KEY);
}

export {
  verifyUser,
  findUser,
  findUserByEmail,
  createUser,
  getUser,
  removeUser,
  getFollowingUsers,
};

// --- Update User ---------------------------------------------------------------------------------------
async function getUsers() {
  const response = await axios.get(API_HOST + "/api/users");

  return response.data;
}

async function updateUser(id, user) {
  const response = await axios.put(`${API_HOST}/api/users/${id}`, user);

  return response.data;
}

export { getUsers, updateUser };

// --- Cart ----------------------------------------------------------------------------------------------
async function addToCart(cartitem) {
  const response = await axios.post(`${API_HOST}/api/cart`, cartitem);

  return response.data;
}

async function getCart(username) {
  const response = await axios.get(`${API_HOST}/api/cart/${username}`);
  return response.data;
}

async function removeItem(cartItem) {
  const response = await axios.delete(`${API_HOST}/api/cart`, {
    data: cartItem,
  });
  return response.data;
}

async function updateQuantity(cartItem) {
  const response = await axios.put(`${API_HOST}/api/cart`, cartItem);
  return response.data;
}

async function clearCart(cartItem) {
  const response = await axios.post(`${API_HOST}/api/cart/clear`, cartItem);
  return response.data;
}

export { addToCart, getCart, removeItem, updateQuantity, clearCart };

// --- Products -----------------------------------------------------------------------------------------
async function getProducts() {
  const response = await axios.get(`${API_HOST}/api/products`);
  return response.data;
}

async function getProductById(id) {
  const response = await axios.get(`${API_HOST}/api/products/select/${id}`);
  return response.data;
}

export { getProducts, getProductById };

// --- Reviews ------------------------------------------------------------------------------------------
async function getReviewsByProduct(id, page = 1, limit = 3) {
  const response = await axios.get(`${API_HOST}/api/reviews/${id}`, {
    params: { page, limit },
  });
  return response.data;
}

async function addReview(review) {
  try {
    const response = await axios.post(`${API_HOST}/api/reviews`, review);
    return response.data;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
}

async function updateReview(id, content) {
  const response = await axios.put(`${API_HOST}/api/reviews/${id}`, content);
  return response.data;
}
async function deleteReview(id) {
  const response = await axios.delete(`${API_HOST}/api/reviews/${id}`);
  return response.data;
}

export { getReviewsByProduct, addReview, updateReview, deleteReview };

// --- Follow --------------------------------------------------------------------------------------------
async function followUser(followed, follower) {
  const response = await axios.post(`${API_HOST}/api/follow/follow`, {
    followed,
    follower,
  });
  return response.data;
}

async function unfollowUser(followed, follower) {
  const response = await axios.post(`${API_HOST}/api/follow/unfollow`, {
    followed,
    follower,
  });
  return response.data;
}

export { followUser, unfollowUser };
