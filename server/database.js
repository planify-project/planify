const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.USER_NAME, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false // Disable logging for production
});

// Test the connection
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1); // Exit if we can't connect to the database
    }
};

// Call the connection test
testConnection();

// Import models
const User = require('./models/user')(sequelize, DataTypes);
const Service = require('./models/service')(sequelize, DataTypes);
const ServiceCategory = require('./models/serviceCategory')(sequelize, DataTypes);
const ServiceMedia = require('./models/serviceMedia')(sequelize, DataTypes);
const ServiceAvailability = require('./models/serviceAvailability')(sequelize, DataTypes);
const Event = require('./models/event')(sequelize, DataTypes);
const EventService = require('./models/eventService')(sequelize, DataTypes);
const EventUser = require('./models/eventUser')(sequelize, DataTypes);
const EventGuest = require('./models/eventGuest')(sequelize, DataTypes);
const Booking = require('./models/booking.js')(sequelize, DataTypes);
const Wishlist = require('./models/wishlist.js')(sequelize, DataTypes);
const WishlistItem = require('./models/wishlistItem.js')(sequelize, DataTypes);
const Message = require('./models/message')(sequelize, DataTypes);
const Review = require('./models/review')(sequelize, DataTypes);
const Feedback = require('./models/feedback')(sequelize, DataTypes);
const Payment = require('./models/payment')(sequelize, DataTypes);
const Offer = require('./models/offer')(sequelize, DataTypes);
const Notification = require('./models/notification')(sequelize, DataTypes);
const MonthlyReport = require('./models/monthlyReport')(sequelize, DataTypes);
const AuditLog = require('./models/auditLog')(sequelize, DataTypes);
const Admin = require('./models/admin')(sequelize, DataTypes);
const Agent = require('./models/Agent')(sequelize, DataTypes);
const EventSpace = require('./models/eventSpace')(sequelize, DataTypes);

// Associations

User.hasMany(Event, { foreignKey: 'created_by' });
Event.belongsTo(User, { foreignKey: 'created_by' });

User.belongsToMany(Event, { through: EventUser, foreignKey: 'user_id', otherKey: 'event_id' });
Event.belongsToMany(User, { through: EventUser, foreignKey: 'event_id', otherKey: 'user_id' });

Event.hasMany(EventGuest, { foreignKey: 'event_id' });
EventGuest.belongsTo(Event, { foreignKey: 'event_id' });

User.hasMany(EventGuest, { foreignKey: 'user_id' });
EventGuest.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Service, { foreignKey: 'provider_id' });
Service.belongsTo(User, { foreignKey: 'provider_id' });

Service.belongsTo(ServiceCategory, { foreignKey: 'category_id' });
ServiceCategory.hasMany(Service, { foreignKey: 'category_id' });

Event.belongsToMany(Service, { through: EventService, foreignKey: 'event_id', otherKey: 'service_id' });
Service.belongsToMany(Event, { through: EventService, foreignKey: 'service_id', otherKey: 'event_id' });

User.hasMany(Booking, { foreignKey: 'user_id' });
Booking.belongsTo(User, { foreignKey: 'user_id' });
Service.hasMany(Booking, { foreignKey: 'service_id' });
Booking.belongsTo(Service, { foreignKey: 'service_id' });
Event.hasMany(Booking, { foreignKey: 'event_id' });
Booking.belongsTo(Event, { foreignKey: 'event_id' });

Admin.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Admin, { foreignKey: 'user_id' });

User.hasMany(Wishlist, { foreignKey: 'user_id' });
Wishlist.belongsTo(User, { foreignKey: 'user_id' });
Wishlist.hasMany(WishlistItem, { foreignKey: 'wishlist_id' });
WishlistItem.belongsTo(Wishlist, { foreignKey: 'wishlist_id' });

User.hasMany(Message, { foreignKey: 'from_user_id', as: 'SentMessages' });
User.hasMany(Message, { foreignKey: 'to_user_id', as: 'ReceivedMessages' });
Message.belongsTo(User, { foreignKey: 'from_user_id', as: 'Sender' });
Message.belongsTo(User, { foreignKey: 'to_user_id', as: 'Recipient' });
Message.belongsTo(Event, { foreignKey: 'event_id' });

User.hasMany(Review, { foreignKey: 'reviewer_id' });
Review.belongsTo(User, { foreignKey: 'reviewer_id' });
Service.hasMany(Review, { foreignKey: 'service_id' });
Review.belongsTo(Service, { foreignKey: 'service_id' });

User.hasMany(Feedback, { foreignKey: 'user_id' });
Feedback.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Payment, { foreignKey: 'user_id' });
Payment.belongsTo(User, { foreignKey: 'user_id' });
Payment.belongsTo(Event, { foreignKey: 'event_id' });
Payment.belongsTo(Service, { foreignKey: 'service_id' });

User.hasMany(Offer, { foreignKey: 'provider_id' });
Offer.belongsTo(User, { foreignKey: 'provider_id' });

User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

Admin.hasMany(AuditLog, { foreignKey: 'admin_id' });
AuditLog.belongsTo(Admin, { foreignKey: 'admin_id' });

Event.hasMany(Message, { foreignKey: 'event_id' });
Message.belongsTo(Event, { foreignKey: 'event_id' });

User.hasMany(Message, { foreignKey: 'from_user_id' });
Message.belongsTo(User, { foreignKey: 'from_user_id' });

User.hasMany(Message, { foreignKey: 'to_user_id' });
Message.belongsTo(User, { foreignKey: 'to_user_id' });

Event.hasMany(Payment, { foreignKey: 'event_id' });
Payment.belongsTo(Event, { foreignKey: 'event_id' });

User.hasMany(Payment, { foreignKey: 'user_id' });
Payment.belongsTo(User, { foreignKey: 'user_id' });

Service.hasMany(Payment, { foreignKey: 'service_id' });
Payment.belongsTo(Service, { foreignKey: 'service_id' });

Event.belongsTo(EventSpace, { foreignKey: 'event_space_id' });
EventSpace.hasMany(Event, { foreignKey: 'event_space_id' });

// Sync database
// sequelize.sync({ force: true })
//   .then(() => {
//     console.log('Database synced successfully');
//   })
//   .catch(err => {
//     console.error('Error syncing database:', err);
//   });

// Export all models and sequelize instance
module.exports = {
    sequelize,
    Sequelize,
    User,
    Service,
    ServiceCategory,
    ServiceMedia,
    ServiceAvailability,
    Event,
    EventService,
    EventUser,
    EventGuest,
    Booking,
    Wishlist,
    WishlistItem,
    Message,
    Review,
    Feedback,
    Payment,
    Offer,
    Notification,
    MonthlyReport,
    AuditLog,
    Admin,
    Agent,
    EventSpace
};
