module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "follow",
    {
      followed: {
        type: DataTypes.STRING(32),
        allowNull: false,
        primaryKey: true,
        references: {
          model: "users",
          key: "username",
        },
      },
      follower: {
        type: DataTypes.STRING(32),
        allowNull: false,
        primaryKey: true,
        references: {
          model: "users",
          key: "username",
        },
      },
    },
    {
      tableName: "followers",
    }
  );
};
