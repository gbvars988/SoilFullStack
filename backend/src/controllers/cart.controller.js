const db = require("../database");

/**
 * Add to existing cart or create new cart and add items.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.body.username - The username of the user.
 * @param {number} req.body.productId - The ID of the product to add.
 * @param {number} req.body.quantity - The quantity of the product to add.
 * @returns {void} Sends a JSON response with the updated cart detail or an error message.
 */
exports.addToCart = async (req, res) => {
  try {
    const { username, productId, quantity } = req.body;

    // Validate request body
    if (!username || !productId || !quantity) {
      return res.status(400).json({
        error: "All fields (username, productId, quantity) are required.",
      });
    }

    console.log("Request Body:", req.body);

    // Find or create a cart for the user
    const [cart, created] = await db.cart.findOrCreate({
      where: { username },
    });
    console.log("Cart:", cart, "Created:", created);

    // Find or create a cart detail entry
    const [cartDetail, detailCreated] = await db.cartdetail.findOrCreate({
      where: { cart_id: cart.cart_id, product_id: productId },
      defaults: { quantity },
    });
    console.log("CartDetail:", cartDetail, "Detail Created:", detailCreated);

    // If the cart detail entry already exists, update the quantity
    if (!detailCreated) {
      cartDetail.quantity += quantity;
      await cartDetail.save();
      console.log("Updated CartDetail:", cartDetail);
    }

    res.json(cartDetail);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieve cart and associated products based on username.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.params.username - The username of the user.
 * @returns {void} Sends a JSON response with the cart details or an error message.
 */
exports.getCart = async (req, res) => {
  try {
    const { username } = req.params;

    const cart = await db.cart.findOne({
      where: { username },
      include: db.cartdetail,
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const cartDetails = await db.cartdetail.findAll({
      where: { cart_id: cart.cart_id },
      include: db.product,
    });

    res.json(cartDetails);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Remove an item from cart.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.body.username - The username of the user.
 * @param {number} req.body.productId - The ID of the product to remove.
 * @returns {void} Sends a JSON response with a success message or an error message.
 */
exports.removeItem = async (req, res) => {
  try {
    const { username, productId } = req.body;

    const cart = await db.cart.findOne({
      where: { username },
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const cartDetail = await db.cartdetail.findOne({
      where: { cart_id: cart.cart_id, product_id: productId },
    });

    if (!cartDetail) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    await cartDetail.destroy();
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Increase/Decrease quantity of item in cart.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.body.username - The username of the user.
 * @param {number} req.body.productId - The ID of the product to update.
 * @param {number} req.body.quantity - The new quantity of the product.
 * @returns {void} Sends a JSON response with the updated cart detail or an error message.
 */
exports.updateQuantity = async (req, res) => {
  try {
    const { username, productId, quantity } = req.body;

    const cart = await db.cart.findOne({
      where: { username },
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const cartDetail = await db.cartdetail.findOne({
      where: { cart_id: cart.cart_id, product_id: productId },
    });

    if (!cartDetail) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    cartDetail.quantity = quantity;
    await cartDetail.save();

    res.json(cartDetail);
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Clear entire cart.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.body.username - The username of the user.
 * @returns {void} Sends a JSON response with a success message or an error message.
 */
exports.clearCart = async (req, res) => {
  try {
    const { username } = req.body;

    const cart = await db.cart.findOne({
      where: { username },
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    await db.cartdetail.destroy({
      where: { cart_id: cart.cart_id },
    });

    res.json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: error.message });
  }
};
