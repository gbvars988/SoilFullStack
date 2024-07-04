const db = require("../database");

/**
 * Follow a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.body.followed - The username of the user to be followed.
 * @param {string} req.body.follower - The username of the follower.
 * @returns {void} Sends a JSON response with the follow relationship data or an error message.
 */
exports.followUser = async (req, res) => {
  try {
    const { followed, follower } = req.body;

    // Check if the follow relationship already exists
    const existingFollow = await db.follow.findOne({
      where: { followed, follower },
    });

    if (existingFollow) {
      return res
        .status(400)
        .json({ message: "You are already following this user" });
    }

    const follow = await db.follow.create({ followed, follower });
    res.json(follow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Unfollow a user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.body.followed - The username of the user to be unfollowed.
 * @param {string} req.body.follower - The username of the follower.
 * @returns {void} Sends a JSON response with a success message or an error message.
 */
exports.unfollowUser = async (req, res) => {
  try {
    const { followed, follower } = req.body;

    const follow = await db.follow.findOne({
      where: { followed, follower },
    });

    if (!follow) {
      return res
        .status(404)
        .json({ message: "You are not following this user" });
    }

    await follow.destroy();
    res.json({ message: "Unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
