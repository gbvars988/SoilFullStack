module.exports = (sequelize, DataTypes) => {
  return sequelize.define("cart", {
    cart_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true,
      references: {
        model: "users",
        key: "username",
      },
    },
  });
};
