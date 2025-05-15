const Sequelize = require('sequelize');
const { User } = require('../database');
const bcrypt = require('bcryptjs');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user', details: error.message });
  }
};

// Create a new user from Firebase auth
exports.createUserFromFirebase = async (req, res) => {
  try {
    const { uid, email, displayName } = req.body;

    // Check if user already exists
    let user = await User.findOne({ where: { email } });

    if (!user) {
      // Create new user
      user = await User.create({
        name: displayName || email.split('@')[0],
        email,
        firebase_uid: uid
      });
    }

    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error creating user from Firebase:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
      details: error.message
    });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user', details: error.message });
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedData = {
      name,
      email,
      phone,
      contact_details,
    };

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    await user.update(updatedData);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
};

// admin
exports.getTotalUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({ users, usersCount: users.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
};
exports.banUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Toggle ban status, or just set to true if you only want to ban
    const newBanStatus = !user.isBanned;
    await User.update({ isBanned: newBanStatus }, { where: { id: req.params.id } });

    res.json({ message: `User ${newBanStatus ? 'banned' : 'unbanned'} successfully`, isBanned: newBanStatus });
  } catch (error) {
    res.status(500).json({ error: 'Failed to ban user', details: error.message });
  }
};

exports.getUserTrafficByMonth = async (req, res) => {
  try {
    // Get current and previous month date ranges
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const currentMonthStr = currentMonthStart.toISOString().slice(0, 7);
    const previousMonthStr = previousMonthStart.toISOString().slice(0, 7);

    // Count users for current month
    const currentCount = await User.count({
      where: {
        created_at: {
          [Sequelize.Op.gte]: currentMonthStart,
          [Sequelize.Op.lt]: nextMonthStart
        }
      }
    });

    // Count users for previous month
    const previousCount = await User.count({
      where: {
        created_at: {
          [Sequelize.Op.gte]: previousMonthStart,
          [Sequelize.Op.lt]: currentMonthStart
        }
      }
    });

    // Get total customers (all time)
    const totalCustomers = await User.count();

    // Calculate percentage change
    let change = 0;
    let positive = true;
    if (previousCount > 0) {
      change = ((currentCount - previousCount) / previousCount) * 100;
      positive = currentCount >= previousCount;
    } else if (currentCount > 0) {
      change = 100;
      positive = true;
    }

    res.json({
      totalCustomers,
      currentMonth: { month: currentMonthStr, count: currentCount },
      previousMonth: { month: previousMonthStr, count: previousCount },
      change: parseFloat(change.toFixed(2)),
      positive
    });
  } catch (error) {
    console.error('User traffic error:', error);
    res.status(500).json({ error: 'Failed to fetch user traffic', details: error.message, stack: error.stack });
  }
};