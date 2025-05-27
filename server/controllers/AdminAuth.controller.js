const bcrypt = require('bcryptjs');
const { Admin } = require('../database');
const { updateUser } = require('./user.controller');

// Controller for Admin Authentication
module.exports = {
    // Admin Login
    Login: async (req, res) => {
        try {
            console.log("Received body:", req.body);

            const { id, email, password } = req.body;

            // Find admin by id
            const admin = await Admin.findOne({ where: { email } });
            if (!admin) {
                return res.status(404).json({ message: 'Admin not found' });
            }
            // Check password
            const isPasswordValid = await bcrypt.compare(password, admin.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            res.status(200).json({ message: 'Login successful' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    },

    // Admin Registration
    register: async (req, res) => {

        try {
            
            const { id, name, email, password } = req.body;

            // Check if admin already exists
            const existingAdmin = await Admin.findOne({ where: { id } });
            if (existingAdmin) {
                return res.status(400).json({ message: 'Admin already exists' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new admin
            const newAdmin = await Admin.create({ id, name, email, password: hashedPassword });

            res.status(201).json({ message: 'Admin registered successfully', admin: newAdmin });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    },
    updateUser: async (req, res) => {
        try {
            console.log('Update profile request received:', req.body);
            const { id, name, email, image } = req.body;
            // Find user by id
            const user = await Admin.findByPk(id);
            if (!user) {
                console.log('User not found with id:', id);
                return res.status(404).json({ message: 'User not found' });
            }

            console.log('Updating user:', { id, name, image });
            await Admin.update({ name, image }
                , {
                    where: { id },
                }
            )

            res.status(200).json({ message: 'User updated successfully', user });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    },
    // restPassword: async (req, res) => {
    //     try {
    //         const { id, password } = req.body;
    //         // Find user by id
    //         const user = await User.findByPk(id);
    //         if (!user) {
    //             return res.status(404).json({ message: 'User not found' });
    //         }

    //         // Hash password
    //         const hashedPassword= await bcrypt.hash(password,10)

    //     }
    // }
    socialLogin: async (req, res) => {
        const { id, email, name, image } = req.body;

        if (!id || !email || !name) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        try {
            // Check if user exists
            let user = await Admin.findOne({ where: { id } });

            if (!user) {
                // Create a new user
                user = await Admin.create({
                    id,
                    email,
                    name,
                    image,
                    provider: "google",
                });
            }

            return res.status(200).json({ message: "Login successful", user });
        } catch (error) {
            console.error("Social login error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
};

