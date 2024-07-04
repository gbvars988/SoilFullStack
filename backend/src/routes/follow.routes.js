module.exports = (express, app) => {
  const followController = require("../controllers/follow.controller.js");
  const router = express.Router();

  // Follow a user
  router.post("/follow", followController.followUser);

  // Unfollow a user
  router.post("/unfollow", followController.unfollowUser);

  // Add routes to server.
  app.use("/api/follow", router);
};
