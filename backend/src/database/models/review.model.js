module.exports = (sequelize, DataTypes) => {
  return sequelize.define("review", {
    review_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "product_id",
      },
    },
    username: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: false,
      references: {
        model: "users",
        key: "username",
      },
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
    },
    parent_review_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "reviews",
        key: "review_id",
      },
    },
  });
};
