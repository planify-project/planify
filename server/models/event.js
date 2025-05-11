module.exports = (sequelize, DataTypes) => {
  return sequelize.define('event', {
    id: {
      type: DataTypes.INTEGER,  // Keep using INTEGER
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true, // Added for geolocation support
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true, // Added for geolocation support
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true, // Allow null if not all events have a category
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true, // Default to public events
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'cancelled', 'completed'),
      defaultValue: 'pending', // Added more detailed statuses
    },
    maxParticipants: {
      type: DataTypes.INTEGER,
      allowNull: true, // Optional field to limit the number of attendees
    },
    ticketPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true, // Optional field for ticket pricing
    },
    coverImage: {
      type: DataTypes.STRING,
      allowNull: true, // Optional field for the event's cover image URL
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'user', // Assuming the user model is defined in the same database
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    agent_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Optional field for assigning an agent
    },
    attendees_count: {
      type: DataTypes.INTEGER,
      allowNull: true, // Optional field for tracking attendees
    },
    available_spots: {
      type: DataTypes.INTEGER,
      allowNull: true, // Optional field for tracking available spots
    },
    budget: {
      type: DataTypes.DECIMAL,
      allowNull: true, // Optional field for event budget
    },
    is_free: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Indicates whether the event is free
    },
    rating: {
      type: DataTypes.FLOAT, // Use FLOAT for ratings (e.g., 4.5)
      allowNull: true, // Optional field for event ratings
    },
  }, {
    underscored: true,
    timestamps: true
  });
};