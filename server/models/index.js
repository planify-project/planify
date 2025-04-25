const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Import all models
const createUser = require('./user');
const createRole = require('./role');
const createVerification = require('./verification');
const createEvent = require('./event');
const createEventUser = require('./eventUser');
const createEventGuest = require('./eventGuest');
const createService = require('./service');
const createServiceCategory = require('./serviceCategory');
const createServiceMedia = require('./serviceMedia');
const createServiceAvailability = require('./serviceAvailability');
const createMessage = require('./message');
const createReview = require('./review');
const createPayment = require('./payment');
const createOffer = require('./offer');
const createEventBudget = require('./eventBudget');
const createNotification = require('./notification');
const createMonthlyReport = require('./monthlyReport');
const createFeedback = require('./feedback');
const createAuditLog = require('./auditLog');

// Initialize all models
const User = createUser(sequelize, DataTypes);
const Role = createRole(sequelize, DataTypes);
const Verification = createVerification(sequelize, DataTypes);
const Event = createEvent(sequelize, DataTypes);
const EventUser = createEventUser(sequelize, DataTypes);
const EventGuest = createEventGuest(sequelize, DataTypes);
const Service = createService(sequelize, DataTypes);
const ServiceCategory = createServiceCategory(sequelize, DataTypes);
const ServiceMedia = createServiceMedia(sequelize, DataTypes);
const ServiceAvailability = createServiceAvailability(sequelize, DataTypes);
const Message = createMessage(sequelize, DataTypes);
const Review = createReview(sequelize, DataTypes);
const Payment = createPayment(sequelize, DataTypes);
const Offer = createOffer(sequelize, DataTypes);
const EventBudget = createEventBudget(sequelize, DataTypes);
const Notification = createNotification(sequelize, DataTypes);
const MonthlyReport = createMonthlyReport(sequelize, DataTypes);
const Feedback = createFeedback(sequelize, DataTypes);
const AuditLog = createAuditLog(sequelize, DataTypes);

// Define all relationships
// User relationships
User.belongsToMany(Role, {
  through: 'user_roles',
  foreignKey: 'user_id',
  otherKey: 'role_id'
});
User.hasMany(Verification, {
  foreignKey: 'user_id',
  as: 'verifications'
});
User.hasMany(Event, {
  foreignKey: 'created_by',
  as: 'createdEvents'
});
User.belongsToMany(Event, {
  through: EventUser,
  foreignKey: 'user_id',
  otherKey: 'event_id',
  as: 'events'
});
User.hasMany(Service, {
  foreignKey: 'provider_id',
  as: 'services'
});
User.hasMany(Message, {
  foreignKey: 'sender_id',
  as: 'sentMessages'
});
User.hasMany(Message, {
  foreignKey: 'receiver_id',
  as: 'receivedMessages'
});
User.hasMany(Review, {
  foreignKey: 'user_id',
  as: 'reviews'
});
User.hasMany(Payment, {
  foreignKey: 'user_id',
  as: 'payments'
});
User.hasMany(Notification, {
  foreignKey: 'user_id',
  as: 'notifications'
});
User.hasMany(Feedback, {
  foreignKey: 'user_id',
  as: 'feedbacks'
});
User.hasMany(AuditLog, {
  foreignKey: 'admin_id',
  as: 'auditLogs'
});

// Role relationships
Role.belongsToMany(User, {
  through: 'user_roles',
  foreignKey: 'role_id',
  otherKey: 'user_id'
});

// Verification relationships
Verification.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// Event relationships
Event.belongsTo(User, {
  foreignKey: 'created_by',
  as: 'creator'
});
Event.belongsToMany(User, {
  through: EventUser,
  foreignKey: 'event_id',
  otherKey: 'user_id',
  as: 'users'
});
Event.hasMany(EventGuest, {
  foreignKey: 'event_id',
  as: 'guests'
});
Event.belongsToMany(Service, {
  through: 'event_services',
  foreignKey: 'event_id',
  otherKey: 'service_id',
  as: 'services'
});
Event.hasMany(Payment, {
  foreignKey: 'event_id',
  as: 'payments'
});
Event.hasMany(EventBudget, {
  foreignKey: 'event_id',
  as: 'budgets'
});

// Service relationships
Service.belongsTo(User, {
  foreignKey: 'provider_id',
  as: 'provider'
});
Service.belongsTo(ServiceCategory, {
  foreignKey: 'category_id',
  as: 'category'
});
Service.hasMany(ServiceMedia, {
  foreignKey: 'service_id',
  as: 'media'
});
Service.hasMany(ServiceAvailability, {
  foreignKey: 'service_id',
  as: 'availability'
});
Service.belongsToMany(Event, {
  through: 'event_services',
  foreignKey: 'service_id',
  otherKey: 'event_id',
  as: 'events'
});
Service.hasMany(Review, {
  foreignKey: 'service_id',
  as: 'reviews'
});
Service.hasMany(Offer, {
  foreignKey: 'service_id',
  as: 'offers'
});

// ServiceCategory relationships
ServiceCategory.hasMany(Service, {
  foreignKey: 'category_id',
  as: 'services'
});

// ServiceMedia relationships
ServiceMedia.belongsTo(Service, {
  foreignKey: 'service_id',
  as: 'service'
});

// ServiceAvailability relationships
ServiceAvailability.belongsTo(Service, {
  foreignKey: 'service_id',
  as: 'service'
});

// Message relationships
Message.belongsTo(User, {
  foreignKey: 'sender_id',
  as: 'sender'
});
Message.belongsTo(User, {
  foreignKey: 'receiver_id',
  as: 'receiver'
});

// Review relationships
Review.belongsTo(Service, {
  foreignKey: 'service_id',
  as: 'service'
});
Review.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// Payment relationships
Payment.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});
Payment.belongsTo(Event, {
  foreignKey: 'event_id',
  as: 'event'
});

// Offer relationships
Offer.belongsTo(Service, {
  foreignKey: 'service_id',
  as: 'service'
});

// EventBudget relationships
EventBudget.belongsTo(Event, {
  foreignKey: 'event_id',
  as: 'event'
});

// Notification relationships
Notification.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// Feedback relationships
Feedback.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// AuditLog relationships
AuditLog.belongsTo(User, {
  foreignKey: 'admin_id',
  as: 'admin'
});

const syncDatabase = async () => {
  try {
    // First, authenticate the connection
    await sequelize.authenticate();
    console.log('Database connection authenticated successfully');

    // Then sync the models with more specific options
    await sequelize.sync({
      force: false, // Don't drop tables
      alter: {
        drop: false, // Don't drop columns
        add: true    // Allow adding new columns
      }
    });
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error.message);
    if (error.original) {
      console.error('Original error:', error.original);
    }
    throw error;
  }
};

module.exports = {
  sequelize,
  User,
  Role,
  Verification,
  Event,
  EventUser,
  EventGuest,
  Service,
  ServiceCategory,
  ServiceMedia,
  ServiceAvailability,
  Message,
  Review,
  Payment,
  Offer,
  EventBudget,
  Notification,
  MonthlyReport,
  Feedback,
  AuditLog,
  syncDatabase
}; 