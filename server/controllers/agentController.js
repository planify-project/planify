const { Agent } = require('../models/Agent');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const agentController = {
  // Register a new agent
  register: async (req, res) => {
    try {
      const { password, ...agentData } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const agent = await Agent.create({ ...agentData, password: hashedPassword });
      const token = jwt.sign(
        { id: agent.id, email: agent.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
     
      
      res.status(201).json({ agent, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Login agent
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const agent = await Agent.findOne({ where: { email } });
      
      if (!agent) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await bcrypt.compare(password, agent.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: agent.id, email: agent.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ agent, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get all agents (for admin)
  getAllAgents: async (req, res) => {
    try {
      const agents = await Agent.findAll({
        attributes: { exclude: ['password'] }
      });
      res.json(agents);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get pending agents (for admin)
  getPendingAgents: async (req, res) => {
    try {
      const agents = await Agent.findAll({
        where: { isApproved: false },
        attributes: { exclude: ['password'] }
      });
      res.json(agents);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Approve agent (admin only)
  approveAgent: async (req, res) => {
    try {
      const { id } = req.params;
      const agent = await Agent.findByPk(id);
      
      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
      }

      agent.isApproved = true;
      await agent.save();
      
      res.json({ message: 'Agent approved successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Update agent profile
  updateProfile: async (req, res) => {
    try {
      const { id } = req.params;
      const agent = await Agent.findByPk(id);
      
      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
      }

      await agent.update(req.body);
      res.json(agent);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get agent by ID
  getAgentById: async (req, res) => {
    try {
      const { id } = req.params;
      const agent = await Agent.findByPk(id, {
        attributes: { exclude: ['password'] }
      });
      
      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
      }

      res.json(agent);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = agentController; 