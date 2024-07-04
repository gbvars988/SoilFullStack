module.exports = (express, app) => {
  const controller = require("../controllers/product.controller.js");
  const router = express.Router();

  // Select all products.
  router.get("/", controller.all);

  // Select a single product with id.
  router.get("/select/:id", controller.one);

  // Create a new product.
  router.post("/", controller.create);

  // Add routes to server.
  app.use("/api/products", router);
};
