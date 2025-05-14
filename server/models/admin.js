module.exports = (sequelize, DataTypes) => {
  return sequelize.define('admin', {
    id: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }, password: {
      type: DataTypes.STRING,
      allowNull: false
    }, image: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    underscored: true,
    timestamps: true
  });
};