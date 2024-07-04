module.exports = (express, app) => {
  const cartController = require("../controllers/cart.controller.js");
  const router = express.Router();

  // Add to cart
  router.post("/", cartController.addToCart);

  // Get cart from username
  router.get("/:username", cartController.getCart);

  // Remove item from cart
  router.delete("/", cartController.removeItem);

  // Update quantity of item
  router.put("/", cartController.updateQuantity);

  // Clear the entire cart
  router.post("/clear", cartController.clearCart);

  // Add routes to server.
  app.use("/api/cart", router);
};
