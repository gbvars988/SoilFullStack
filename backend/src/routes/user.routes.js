module.exports = (express, app) => {
  const controller = require("../controllers/user.controller.js");
  const router = express.Router();

  // Select all users.
  router.get("/", controller.all);

  // Select a single user with id.
  router.get("/select/:id", controller.one);

  // Select one user from the database if username and password are a match.
  router.get("/login", controller.login);

  // Find user by email.
  router.get("/email/:email", controller.findUserByEmail);

  // Create a new user.
  router.post("/", controller.create);

  // Update user.
  router.put("/:id", controller.update);

  // Get users followers.
  router.get("/following/:username", controller.getFollowingUsers);

  // Add routes to server.
  app.use("/api/users", router);
};
