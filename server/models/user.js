module.exports = (sequelize, DataTypes) => {
  return sequelize.define('user', {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
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
      allowNull: true, // إذا كنت تستخدم كلمة مرور
    },
  }, {
    underscored: true,
    timestamps: true,
    tableName: 'users'
  });
};
