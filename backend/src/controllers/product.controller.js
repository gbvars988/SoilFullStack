const db = require("../database");
const { Sequelize } = require("sequelize");

/**
 * Select all products.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void} Sends a JSON response with all products and their average ratings.
 */
exports.all = async (req, res) => {
  try {
    const products = await db.product.findAll({
      include: [
        {
          model: db.review,
          attributes: [
            [Sequelize.fn("AVG", Sequelize.col("stars")), "averageRating"],
          ],
        },
      ],
      group: ["product.product_id"],
    });
    console.log("return from backend products:", products);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Select one product by ID and return product details and average rating.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.params.id - The ID of the product.
 * @returns {void} Sends a JSON response with the product details and average rating.
 */
exports.one = async (req, res) => {
  try {
    const product = await db.product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const averageRating = await calculateAverageRating(req.params.id);
    res.json({ ...product.dataValues, averageRating });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create a new product.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.body.name - The name of the product.
 * @param {number} req.body.price - The price of the product.
 * @param {string} req.body.description - The description of the product.
 * @param {number} req.body.quantity - The quantity of the product.
 * @returns {void} Sends a JSON response with the created product data.
 */
exports.create = async (req, res) => {
  const product = await db.product.create({
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    quantity: req.body.quantity,
  });

  res.json(product);
};

/**
 * Helper function to calculate average rating for a product.
 *
 * @param {number} productId - The ID of the product.
 * @returns {Promise<number>} The average rating of the product.
 */
const calculateAverageRating = async (productId) => {
  const reviews = await db.review.findAll({
    where: { product_id: productId, parent_review_id: null },
    attributes: ["stars"],
  });

  if (reviews.length === 0) return 0;

  const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
  return totalStars / reviews.length;
};
