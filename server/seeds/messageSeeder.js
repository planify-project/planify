const { Message, User } = require('../database');

const seedMessages = async () => {
  try {
    // Fetch users to use as senders and receivers
    const users = await User.findAll({ limit: 2 });

    if (users.length < 2) {
      console.error('Not enough users to seed messages. Please add more users.');
      return;
    }

    const [user1, user2] = users;

    // Create sample messages
    const messages = [
      {
        senderId: user1.id,
        receiverId: user2.id,
        content: 'Hello! How are you?'
      },
      {
        senderId: user2.id,
        receiverId: user1.id,
        content: 'I am good, thank you! How about you?'
      },
      {
        senderId: user1.id,
        receiverId: user2.id,
        content: 'I am doing well. Thanks for asking!'
      }
    ];

    // Insert messages into the database
    await Message.bulkCreate(messages);

    console.log('Messages seeded successfully!');
  } catch (error) {
    console.error('Error seeding messages:', error);
  }
};

module.exports = seedMessages;
