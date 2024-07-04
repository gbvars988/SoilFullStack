const db = require("../database");
const argon2 = require("argon2");

/**
 * Select all users from the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void} Sends a JSON response with all users.
 */
exports.all = async (req, res) => {
  const users = await db.user.findAll();

  res.json(users);
};

/**
 * Select one user from the database by ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.params.id - The ID of the user.
 * @returns {void} Sends a JSON response with the user data.
 */
exports.one = async (req, res) => {
  const user = await db.user.findByPk(req.params.id);

  res.json(user);
};

/**
 * Find user by email.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.params.email - The email of the user.
 * @returns {void} Sends a JSON response with the user data or an error message.
 */
exports.findUserByEmail = async (req, res) => {
  const email = req.params.email;

  try {
    const user = await db.user.findOne({ where: { email: email } });
    if (user) {
      res.status(200).send(user);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error retrieving user with email=" + email });
  }
};

/**
 * Select one user from the database if username and password are a match.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.query.username - The username of the user.
 * @param {string} req.query.password - The password of the user.
 * @returns {void} Sends a JSON response with the user data if login is successful, otherwise null.
 */
exports.login = async (req, res) => {
  const user = await db.user.findByPk(req.query.username);

  if (
    user === null ||
    (await argon2.verify(user.password_hash, req.query.password)) === false
  )
    // Login failed.
    res.json(null);
  else res.json(user);
};

/**
 * Create a user in the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.body.username - The username of the user.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {string} req.body.firstname - The first name of the user.
 * @param {string} req.body.lastname - The last name of the user.
 * @returns {void} Sends a JSON response with the created user data.
 */
exports.create = async (req, res) => {
  const hash = await argon2.hash(req.body.password, { type: argon2.argon2id });

  const user = await db.user.create({
    username: req.body.username,
    email: req.body.email,
    password_hash: hash,
    first_name: req.body.firstname,
    last_name: req.body.lastname,
  });

  res.json(user);
};

/**
 * Update a user in the database.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.params.id - The ID of the user to update.
 * @param {string} req.body.username - The updated username of the user.
 * @param {string} req.body.email - The updated email of the user.
 * @param {string} req.body.first_name - The updated first name of the user.
 * @param {string} req.body.last_name - The updated last name of the user.
 * @param {string} [req.body.password] - The updated password of the user.
 * @returns {void} Sends a JSON response with the updated user data or an error message.
 */
exports.update = async (req, res) => {
  try {
    const user = await db.user.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = req.body.username;
    user.email = req.body.email;
    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    if (req.body.password) {
      user.password_hash = await argon2.hash(req.body.password, {
        type: argon2.argon2id,
      });
    }

    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get the list of users that the current user is following.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {string} req.params.username - The username of the current user.
 * @returns {void} Sends a JSON response with the list of followed users or an error message.
 */
exports.getFollowingUsers = async (req, res) => {
  try {
    const { username } = req.params;
    console.log(`Fetching following users for: ${username}`);

    const following = await db.user.findAll({
      include: {
        model: db.user,
        as: "following",
        through: {
          attributes: [],
        },
        attributes: ["username"],
        required: true,
      },
      where: {
        username: username,
      },
    });

    const followingUsers = following.flatMap((user) =>
      user.following.map((f) => f.username)
    );
    console.log(
      `Found following users: ${JSON.stringify(followingUsers, null, 2)}`
    );

    res.json(followingUsers);
  } catch (error) {
    console.error("Error fetching following users: ", error);
    res.status(500).json({ error: error.message });
  }
};
