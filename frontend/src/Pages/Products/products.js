/**
 * @fileoverview Products component that fetches and displays a list of products,
 * allows users to add products to the cart, and displays the cart subtotal.
 */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./products.css";
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
import { useCart } from "../../Pages/Cart/useCart";
import { getProducts } from "../../Data/repository";
import ReactStars from "react-stars";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/**
 * Products component.
 * Fetches (from API) and displays products and handles adding products to the cart.
 * @returns {JSX.Element}
 */
export default function Products() {
  const [products, setProducts] = useState([]);
  const [specialProducts, setSpecialProducts] = useState([]);
  const { cart, addToCart, clearCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        console.log("Fetched products data: ", data);
        setProducts(data.filter((product) => !product.is_special));
        setSpecialProducts(data.filter((product) => product.is_special));
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  /**
   * Calculate the subtotal of the items in the cart.
   * @returns {number} The subtotal of the items in the cart.
   */
  const calculateSubtotal = () => {
    return Object.values(cart).reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
  };

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

  /**
   * Handles adding a product to the cart and shows a success toast message.
   * @param {object} product - The product to add to the cart.
   */
  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="products-bg">
      <div className="cart-subtotal">
        <h2>Cart Subtotal</h2>
        <p>${calculateSubtotal().toFixed(2)}</p>
        <button className="button" onClick={clearCart}>
          Clear Cart
        </button>
        <Link to="/cart">
          <button className="button">View Cart</button>
        </Link>
      </div>
      <div className="container">
        <div className="products-container">
          <h2>Standard Products</h2>
          <div className="normal-products">
            {products.map((product) => (
              <div key={product.product_id} className="product-container">
                <Link to={`/products/${product.product_id}`}>
                  <img
                    src={productImages[product.name]}
                    alt={product.name}
                    className="product-image"
                  />
                  <h3>{product.name}</h3>
                </Link>
                <p className="product-description">{product.description}</p>
                <p>Price: ${product.price}</p>
                <ReactStars
                  count={5}
                  value={product.reviews?.[0]?.averageRating || 0}
                  size={24}
                  color2={"#ffd700"}
                  edit={false}
                  half={false}
                />
                <button
                  className="button"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
          <h2>Special Products</h2>
          <div className="special-products">
            {specialProducts.map((product) => (
              <div key={product.product_id} className="product-container">
                <Link to={`/products/${product.product_id}`}>
                  <img
                    src={productImages[product.name]}
                    alt={product.name}
                    className="product-image"
                  />
                  <h3>{product.name}</h3>
                </Link>
                <p className="product-description">{product.description}</p>
                <p>Price: ${product.price}</p>
                <ReactStars
                  count={5}
                  value={product.reviews?.[0]?.averageRating || 0}
                  size={24}
                  color2={"#ffd700"}
                  edit={false}
                  half={false}
                />
                <button
                  className="button"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
