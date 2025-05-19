module.exports = (sequelize, DataTypes) => {
  return sequelize.define('admin', {
    id: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: true, // "email", "google", "facebook"
      defaultValue: "email"
    }
  }, {
    underscored: true,
    timestamps: true
  });
};
