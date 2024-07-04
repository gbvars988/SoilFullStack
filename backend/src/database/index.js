const { Sequelize, DataTypes } = require("sequelize");
const config = require("./config.js");
const {
  getRandomInt,
  getRandomUser,
  getRandomRating,
  getRandomContent,
} = require("../utils/helpers.js");

const db = {
  Op: Sequelize.Op,
};

// Create Sequelize.
db.sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.DIALECT,
});

// Include models (ensure table without fk constraints are created first)
db.user = require("./models/user.model.js")(db.sequelize, DataTypes);
db.follow = require("./models/follow.model.js")(db.sequelize, DataTypes);
db.product = require("./models/product.model.js")(db.sequelize, DataTypes);
db.cart = require("./models/cart.model.js")(db.sequelize, DataTypes);
db.cartdetail = require("./models/cartdetail.model.js")(
  db.sequelize,
  DataTypes
);
db.review = require("./models/review.model.js")(db.sequelize, DataTypes);

// Define relationships
db.user.hasOne(db.cart, { foreignKey: "username" });
db.cart.belongsTo(db.user, { foreignKey: "username" });

db.cart.hasMany(db.cartdetail, { foreignKey: "cart_id" });
db.cartdetail.belongsTo(db.cart, { foreignKey: "cart_id" });

db.product.hasMany(db.cartdetail, { foreignKey: "product_id" });
db.cartdetail.belongsTo(db.product, { foreignKey: "product_id" });

db.product.hasMany(db.review, { foreignKey: "product_id" });
db.review.belongsTo(db.product, { foreignKey: "product_id" });

db.user.hasMany(db.review, { foreignKey: "username" });
db.review.belongsTo(db.user, { foreignKey: "username" });

db.review.hasMany(db.review, { as: "replies", foreignKey: "parent_review_id" });
db.review.belongsTo(db.review, {
  as: "parent",
  foreignKey: "parent_review_id",
});

db.user.belongsToMany(db.user, {
  through: db.follow,
  as: "followers",
  foreignKey: "followed",
  otherKey: "follower",
});

db.user.belongsToMany(db.user, {
  through: db.follow,
  as: "following",
  foreignKey: "follower",
  otherKey: "followed",
});

// Include a sync option with seed data logic included.
db.sync = async () => {
  // Sync schema.
  await db.sequelize.sync({ force: true });

  // Can sync with force if the schema has become out of date - note that syncing with force is a destructive operation.
  // await db.sequelize.sync({ force: true });

  await seedData();
};

// Function to seed data
async function seedData() {
  const count = await db.user.count();
  const count2 = await db.product.count();

  // Only seed data if necessary.
  if (count > 0 && count2 > 0) return;

  // Seed users
  const argon2 = require("argon2");

  let hash = await argon2.hash("abc123", { type: argon2.argon2id });

  const Anth = await db.user.create({
    username: "Anth",
    email: "Anth@test.com",
    password_hash: hash,
    first_name: "Anthony",
    last_name: "Tran",
  });

  hash = await argon2.hash("def456", { type: argon2.argon2id });
  const Ron = await db.user.create({
    username: "Ron",
    email: "Ron@test.com",
    password_hash: hash,
    first_name: "Ronald",
    last_name: "Ho",
  });

  hash = await argon2.hash("abcabc", { type: argon2.argon2id });
  const Jennifer = await db.user.create({
    username: "Jennifer",
    email: "jen@test.com",
    password_hash: hash,
    first_name: "Jennifer",
    last_name: "Jemima",
  });

  hash = await argon2.hash("abcabc", { type: argon2.argon2id });
  const Amy = await db.user.create({
    username: "Amy",
    email: "Amy@test.com",
    password_hash: hash,
    first_name: "Amy",
    last_name: "Jem",
  });

  hash = await argon2.hash("abcabc", { type: argon2.argon2id });
  const Maggie = await db.user.create({
    username: "Maggie",
    email: "mag@test.com",
    password_hash: hash,
    first_name: "Maggie",
    last_name: "Waters",
  });

  hash = await argon2.hash("abcabc", { type: argon2.argon2id });
  const Karen = await db.user.create({
    username: "Karen",
    email: "karen@test.com",
    password_hash: hash,
    first_name: "Karen",
    last_name: "Loud",
  });

  // Seed products
  const products = await db.product.bulkCreate([
    {
      name: "Apple",
      price: 5,
      description: "Crunchy Apple",
    },
    {
      name: "Banana",
      price: 3,
      description: "A delicious banana",
    },
    {
      name: "Pear",
      price: 4,
      description: "A juicy pear",
    },
    {
      name: "Strawberry",
      price: 4,
      description: "A bright red strawberry",
    },
    {
      name: "Grape",
      price: 7,
      description: "A crunchy grape",
    },
    {
      name: "Kiwi",
      price: 6,
      description: "A tangy kiwi",
    },
    {
      name: "Orange",
      price: 5,
      description: "A sweet orange",
    },
    {
      name: "Pineapple",
      price: 8,
      description: "A tropical pineapple",
    },
    {
      name: "Watermelon",
      price: 10,
      description: "A refreshing watermelon",
    },
    {
      name: "Steak",
      price: 50,
      description: "Succulent steak",
      is_special: true,
    },
    {
      name: "Lobster",
      price: 50,
      description: "Lovely Lobster",
      is_special: true,
    },
    {
      name: "Caviar",
      price: 100,
      description: "Luxurious Caviar",
      is_special: true,
    },
    {
      name: "Truffle",
      price: 200,
      description: "Exquisite Truffle",
      is_special: true,
    },
    {
      name: "Oyster",
      price: 30,
      description: "Fresh Oyster",
      is_special: true,
    },
  ]);

  // Seed reviews for each product
  const users = [Anth, Ron, Jennifer, Karen, Maggie, Amy];

  const reviews = [];
  for (const product of products) {
    // 7 reviews per product
    for (let i = 0; i < 7; i++) {
      const user = getRandomUser(users);
      reviews.push({
        content: getRandomContent(),
        stars: getRandomRating(),
        product_id: product.product_id,
        username: user.username,
      });
    }
  }

  const createdReviews = await db.review.bulkCreate(reviews);

  // Seed replies for each review
  const replies = [];
  for (const review of createdReviews) {
    const numReplies = getRandomInt(1, 4); // Each review will have 1 to 3 replies
    for (let j = 0; j < numReplies; j++) {
      const user = getRandomUser(users);
      replies.push({
        content: getRandomContent(),
        stars: getRandomRating(),
        product_id: review.product_id,
        username: user.username,
        parent_review_id: review.review_id,
      });
    }
  }

  await db.review.bulkCreate(replies);
}

module.exports = db;
