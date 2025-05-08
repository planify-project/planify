module.exports = (sequelize, DataTypes) => {
  return sequelize.define('event', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, // Event name is required
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true, // Optional field for event details
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true, // Supports event categories like "wedding", "meeting", etc.
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false, // Start date is required
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true, // Optional for multi-day events
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true, // Optional for private events
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true, // Added for geolocation support
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true, // Added for geolocation support
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Renamed from "visibility" for clarity
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
      type: DataTypes.STRING,
      allowNull: false, // Required for tracking the event creator
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
  }, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    paranoid: false, // Enables soft deletes (adds deletedAt field)
  });
};
