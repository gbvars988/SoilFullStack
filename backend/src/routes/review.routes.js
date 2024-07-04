module.exports = (express, app) => {
  const reviewController = require("../controllers/review.controller.js");
  const router = express.Router();

  router.post("/", reviewController.createReview);

  router.get("/:product_id", reviewController.getReviewsByProduct);

  router.put("/:review_id", reviewController.updateReview);

  router.delete("/:review_id", reviewController.deleteReview);

  // Add routes to server.
  app.use("/api/reviews", router);
};
