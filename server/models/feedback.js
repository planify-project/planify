// module.exports = (sequelize, DataTypes) => {
//   return sequelize.define('feedback', {
//     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//     user_id: DataTypes.STRING,
//     message: DataTypes.TEXT
//   }, {
//     underscored: true,
//     timestamps: true
//   });
// };

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('feedback', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: {
      type: DataTypes.UUID, // Match the type of `users.id`
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
    },
    message: DataTypes.TEXT,
  }, {
    underscored: true,
    timestamps: true,
  });
};