/**
 * Utility functions used to automate data seeding.
 */

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomUser(users) {
  return users[getRandomInt(0, users.length)];
}

function getRandomRating() {
  return getRandomInt(1, 6);
}

function getRandomContent() {
  const contents = [
    "Great product!!!!",
    "Really enjoyed this. Deliciousness through and through",
    "Would buy again. Recommended",
    "Not as expected...",
    "Amazing quality.",
    "Just okay.",
    "Not worth your money - avoid at all costs.",
    "It's so nice to connect with y'all!",
    "Super fresh. You can't get any fresher than that my friends.",
  ];
  return contents[getRandomInt(0, contents.length)];
}

module.exports = {
  getRandomInt,
  getRandomUser,
  getRandomRating,
  getRandomContent,
};
