// module.exports = (sequelize, DataTypes) => {
//   return sequelize.define('user', {
//     id: {
//       type: DataTypes.STRING, // Firebase UID is a string
//       primaryKey: true,
//       allowNull: false,
//     },
//     name: DataTypes.STRING,
//     email: {
//       type: DataTypes.STRING,
//       unique: true,
//       allowNull: false,
//     },
//     phone: DataTypes.STRING,
//     contact_details: DataTypes.JSON,
//   }, {
//     underscored: true,
//     timestamps: false,
//   });
// };

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('user', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    phone: DataTypes.STRING,
    contact_details: DataTypes.JSON,
  }, {
    tableName: 'user', 
    underscored: true,
    timestamps: false,
  });
};
