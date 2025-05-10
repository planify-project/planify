module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "booking",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.UUID,
      },
      service_id: {
        type: DataTypes.INTEGER,
      },
      event_id: {
        type: DataTypes.UUID,
      },
      date: {
        type: DataTypes.DATE,
      },
      space: {
        type: DataTypes.STRING,
      },
      phone_number: {
        type: DataTypes.STRING,
      },

      status: {
        type: DataTypes.ENUM("requested", "confirmed", "canceled", "completed"),
      },
      created_at: {
        type: DataTypes.DATE,
      },
    },
    {
      underscored: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );
};
