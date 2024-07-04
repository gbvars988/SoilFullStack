import { useState, useEffect } from "react";
import { useUser } from "../../Context/UserContext";
import {
  addToCart as addToCartApi,
  getCart as getCartApi,
  removeItem as removeItemApi,
  updateQuantity as updateQuantityApi,
  clearCart as clearCartApi,
} from "../../Data/repository";

/**
 * Custom hook to manage the shopping cart functionality.
 *
 * @returns {object} - The cart state and cart operation functions.
 */
export const useCart = () => {
  const [cart, setCart] = useState({});
  const { user } = useUser();

  useEffect(() => {
    const fetchCart = async () => {
      if (user && user.username) {
        try {
          const cartData = await getCartApi(user.username);
          const cartItems = cartData.reduce((acc, item) => {
            acc[item.product_id] = {
              ...item.product,
              quantity: item.quantity,
            };
            return acc;
          }, {});
          setCart(cartItems);
          localStorage.setItem("cart", JSON.stringify(cartItems));
        } catch (error) {
          console.error("Error fetching cart:", error);
        }
      }
    };
    fetchCart();
  }, [user]);

  /**
   * Adds a product to the cart.
   * @param {object} product - The product to add.
   */
  const addToCart = async (product) => {
    try {
      const cartItem = {
        username: user.username,
        productId: product.product_id,
        quantity: 1,
      };

      const response = await addToCartApi(cartItem);
      const newCartDetail = response;

      setCart((prevCart) => ({
        ...prevCart,
        [newCartDetail.product_id]: {
          ...product,
          quantity: newCartDetail.quantity,
        },
      }));

      localStorage.setItem("cart", JSON.stringify(cart));
      console.log("Added to cart:", product);
    } catch (error) {
      console.log("Error adding to cart", error);
    }
  };

  /**
   * Removes an item from the cart.
   * @param {number} productId - The id of the product to remove.
   */
  const removeItem = async (productId) => {
    try {
      const cartItem = {
        username: user.username,
        productId,
      };

      await removeItemApi(cartItem);

      setCart((prevCart) => {
        const newCart = { ...prevCart };
        delete newCart[productId];
        localStorage.setItem("cart", JSON.stringify(newCart));
        return newCart;
      });

      console.log("Removed item with ID:", productId);
    } catch (error) {
      console.log("Error removing item", error);
    }
  };

  /**
   * Increases the quantity of an item in the cart.
   * @param {number} productId - The id of the product to increase qty.
   */
  const increaseQuantity = async (productId) => {
    try {
      const cartItem = {
        username: user.username,
        productId,
        quantity: cart[productId].quantity + 1,
      };

      const response = await updateQuantityApi(cartItem);

      setCart((prevCart) => {
        const newCart = {
          ...prevCart,
          [productId]: {
            ...prevCart[productId],
            quantity: response.quantity,
          },
        };
        localStorage.setItem("cart", JSON.stringify(newCart));
        return newCart;
      });

      console.log("Increased quantity for item with ID:", productId);
    } catch (error) {
      console.log("Error increasing quantity", error);
    }
  };

  /**
   * Decrease the quantity of an item in the cart.
   * @param {number} productId - The id of the product to decrease qty.
   */
  const decreaseQuantity = async (productId) => {
    try {
      const cartItem = {
        username: user.username,
        productId,
        quantity: cart[productId].quantity - 1,
      };
      if (cartItem.quantity <= 0) {
        removeItem(productId);
        return;
      }

      const response = await updateQuantityApi(cartItem);

      setCart((prevCart) => {
        const newCart = { ...prevCart };
        if (response.quantity <= 0) {
          delete newCart[productId];
        } else {
          newCart[productId].quantity = response.quantity;
        }
        localStorage.setItem("cart", JSON.stringify(newCart));
        return newCart;
      });

      console.log("Decreased quantity for item with ID:", productId);
    } catch (error) {
      console.log("Error decreasing quantity", error);
    }
  };

  /**
   * Updates the quantity of an item in the cart.
   * @param {number} productId - The id of the product to update.
   * @param {number} quantity - The new quantity.
   */
  const updateQuantity = async (productId, quantity) => {
    if (quantity === "" || isNaN(quantity) || quantity < 0) {
      return;
    }

    try {
      const cartItem = {
        username: user.username,
        productId,
        quantity,
      };

      const response = await updateQuantityApi(cartItem);

      setCart((prevCart) => {
        const newCart = { ...prevCart };
        newCart[productId].quantity = response.quantity;
        localStorage.setItem("cart", JSON.stringify(newCart));
        return newCart;
      });

      console.log(
        "Updated quantity for item with ID:",
        productId,
        "to:",
        quantity
      );
    } catch (error) {
      console.log("Error updating quantity", error);
    }
  };
  /**
   * Removes all items in cart.
   * Also removes cart from localStorage.
   */
  const clearCart = async () => {
    try {
      const cartItem = {
        username: user.username,
      };

      await clearCartApi(cartItem);

      setCart({});
      localStorage.removeItem("cart");
      console.log("Cart cleared");
    } catch (error) {
      console.log("Error clearing cart", error);
    }
  };

  /**
   * Calculates the total cost of items in the cart.
   * @returns {number} - The total cost of items in the cart.
   */
  const calculateTotal = () => {
    return Object.values(cart).reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
  };

  /**
   * Gets the total count of items in the cart.
   * @returns {number} - The total count of items in the cart.
   */
  const getItemCount = () => {
    return Object.values(cart).reduce(
      (total, product) => total + product.quantity,
      0
    );
  };

  return {
    cart,
    addToCart,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    updateQuantity,
    clearCart,
    calculateTotal,
    getItemCount,
  };
};
