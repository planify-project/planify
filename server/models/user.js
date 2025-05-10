module.exports = (sequelize, DataTypes) => {
  return sequelize.define('user', {
    id: {
      type: DataTypes.STRING, // Firebase UID is a string
      primaryKey: true,
      allowNull: false,
    },
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    phone: DataTypes.STRING,
    contact_details: DataTypes.JSON,
    password: {
      type: DataTypes.STRING,
      allowNull: false, // إذا كنت تستخدم كلمة مرور
    },
  }, {
    underscored: true,
    timestamps: false,
  });
};
