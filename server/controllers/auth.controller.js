const { User } = require('../database');
const bcrypt = require('bcryptjs');

// Register a new user (expects Firebase UID as ID)
exports.register = async (req, res) => {
    try {
        const { id, name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findByPk(id);
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists.' });
        }

        // Optional: Hash password if needed (Firebase handles auth, but you can store hashed password)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in database
        const newUser = await User.create({
            id,
            name,
            email,
            password: hashedPassword, // Optional: hash if needed
        });

        res.status(201).json({ message: 'User registered successfully.', user: newUser });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

// Login a user (simply checks existence in DB; Firebase handles auth)
exports.login = async (req, res) => {
    try {
        const { id } = req.body;

        const existingUser = await User.findByPk(id);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found in database.' });
        }

        res.status(200).json({ message: 'Login successful.', user: existingUser });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
    
};
exports.updateUser= async (req, res) => {
    try {
        const { id, name, image, phone, contact_details } = req.body;
        // Find user by id
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

         await User.update({ name, image, contact_details, phone }
            , {
            where: { id },
            }
        )

        res.status(200).json({ message: 'User updated successfully', user });           
    }catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}