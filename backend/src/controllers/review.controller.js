const db = require("../database");

/**
 * Creates a new review or reply.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.body.content - The content of the review or reply.
 * @param {number} [req.body.stars] - The rating of the review (1 to 5).
 * @param {string} req.body.product_id - The ID of the product.
 * @param {string} req.body.username - The username of the reviewer.
 * @param {string} [req.body.parent_review_id] - The ID of the parent review, if it's a reply.
 *
 * @returns {void} Sends a JSON response with the created review or reply.
 *
 * @throws {Error} If there is an error creating the review or reply.
 */
exports.createReview = async (req, res) => {
  try {
    const { content, stars, product_id, username, parent_review_id } = req.body;

    console.log("Received data:", req.body); // Log received data

    // Validate stars if it's a review (parent_review_id is null)
    if (!parent_review_id && (stars < 1 || stars > 5)) {
      return res.status(400).json({ message: "Stars must be between 1 and 5" });
    }

    const review = await db.review.create({
      content,
      stars: parent_review_id ? null : stars, // Only set stars if it's jnot a reply
      product_id,
      username,
      parent_review_id: parent_review_id || null,
    });

    res.json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ error: error.message });
  }
};
/**
 * Retrieve reviews and replies by product.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.params.product_id - The ID of the product.
 * @param {number} [req.query.page=1] - The page number for pagination.
 * @param {number} [req.query.limit=5] - The number of reviews per page.
 *
 * @returns {void} Sends a JSON response with reviews, total pages, and current page.
 *
 * @example
 * // Example of how to call this endpoint
 * // GET /api/reviews/12345?page=1&limit=5
 *
 * @throws {Error} If there is an error fetching reviews from the database.
 */
// Retrieve reviews and replies by product
exports.getReviewsByProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { page = 1, limit = 5 } = req.query;
    const offset = (page - 1) * parseInt(limit, 10);

    const { count, rows: reviews } = await db.review.findAndCountAll({
      where: { product_id, parent_review_id: null },
      include: [
        { model: db.user, attributes: ["username", "first_name", "last_name"] },
        {
          model: db.review,
          as: "replies",
          include: [
            {
              model: db.user,
              attributes: ["username", "first_name", "last_name"],
            },
          ],
          order: [["createdAt", "DESC"]], // Ensure reviews are sorted by most recent first.
        },
      ],
      offset,
      limit: parseInt(limit, 10),
      order: [["createdAt", "DESC"]],
      distinct: true,
    });
    console.log({
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10),
    });
    res.json({
      reviews,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10),
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Edit a review by ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.params.review_id - The ID of the review to update.
 * @param {string} req.body.content - The updated content of the review.
 * @param {number} req.body.stars - The updated rating of the review (1 to 5).
 *
 * @returns {void} Sends a JSON response with the updated review.
 *
 * @throws {Error} If there is an error updating the review.
 */
exports.updateReview = async (req, res) => {
  try {
    const { review_id } = req.params;
    const { content, stars } = req.body;

    const review = await db.review.findByPk(review_id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Validate stars
    if (stars < 1 || stars > 5) {
      return res.status(400).json({ message: "Stars must be between 1 and 5" });
    }

    review.content = content;
    review.stars = stars;
    await review.save();

    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete a review by ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.params.review_id - The ID of the review to delete.
 *
 * @returns {void} Sends a JSON response with a success message.
 *
 * @throws {Error} If there is an error deleting the review.
 */
exports.deleteReview = async (req, res) => {
  try {
    const { review_id } = req.params;

    const review = await db.review.findByPk(review_id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await review.destroy();

    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
