module.exports = (sequelize, DataTypes) => {
  return sequelize.define('event', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    date: DataTypes.DATE,
    location: DataTypes.STRING,
    created_by: DataTypes.INTEGER,
    budget: DataTypes.DECIMAL,
    status: DataTypes.STRING,
    is_self_planned: DataTypes.BOOLEAN,
    agent_id: DataTypes.INTEGER,
    visibility: DataTypes.ENUM('public', 'private'),
    is_free: DataTypes.BOOLEAN,
    price: DataTypes.DECIMAL,
    attendees_count: DataTypes.INTEGER,
    available_spots: DataTypes.INTEGER
  }, {
    underscored: true,
    timestamps: true
  });
};