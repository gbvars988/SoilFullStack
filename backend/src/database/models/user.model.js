module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "user",
    {
      username: {
        type: DataTypes.STRING(32),
        primaryKey: true,
        unique: true,
      },
      email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
        validate: {
          customValidator(value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
              throw new Error("Must be a valid email address");
            }
          },
        },
      },
      password_hash: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
    },
    {
      // Don't add the timestamp attributes (updatedAt, createdAt).
      timestamps: false,
      tableName: "users",
    }
  );
