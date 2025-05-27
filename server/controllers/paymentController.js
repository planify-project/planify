const { Payment, User } = require('../database');
const { Op } = require('sequelize');

const getPayments = async (req, res) => {
    try {
        const payments = await Payment.findAll({
            order: [['created_at', 'DESC']],
            limit: 100, // Limit to last 100 payments
            include: [{
                model: User,
                attributes: ['name'] // Only include the user's name
            }]
        });

        // Convert amount to number for each payment and format with user name
        const formattedPayments = payments.map(payment => ({
            ...payment.toJSON(),
            amount: parseFloat(payment.amount),
            userName: payment.user ? payment.user.name : 'Unknown User' // Get user name, or default
        }));

        res.json(formattedPayments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payments',
            error: error.message
        });
    }
};

// Helper function to calculate change percentage
const calculateChange = (current, previous) => {
    if (previous === 0) {
        return current > 0 ? 100 : 0;
    } else {
        return ((current - previous) / previous) * 100;
    }
};

const getRevenue = async (req, res) => {
    try {
        // Get current month's start and end dates
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        // Get previous month's start and end dates
        const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

        console.log('Date ranges:', {
            currentMonthStart: currentMonthStart.toISOString(),
            currentMonthEnd: currentMonthEnd.toISOString(),
            previousMonthStart: previousMonthStart.toISOString(),
            previousMonthEnd: previousMonthEnd.toISOString()
        });

        // Fetch ALL payments for current and previous months within the date range
        const currentMonthPayments = await Payment.findAll({
            where: {
                created_at: {
                    [Op.between]: [currentMonthStart, currentMonthEnd]
                }
                // Removed status: 'completed' filter here
            }
        });

        const previousMonthPayments = await Payment.findAll({
            where: {
                created_at: {
                    [Op.between]: [previousMonthStart, previousMonthEnd]
                }
                // Removed status: 'completed' filter here
            }
        });

        // Calculate statistics for current month
        const currentTotalRevenue = currentMonthPayments
            .filter(p => p.status === 'completed') // Only sum completed for revenue
            .reduce((sum, p) => sum + parseFloat(p.amount), 0);
        const currentTotalPayments = currentMonthPayments.filter(p => p.status === 'completed').length; // Only count completed payments
        const currentSuccessfulPayments = currentMonthPayments.filter(p => p.status === 'completed').length;
        const currentAverageAmount = currentMonthPayments.length > 0 ? currentTotalRevenue / currentMonthPayments.length : 0;
        const currentSuccessRate = currentMonthPayments.length > 0 ? (currentSuccessfulPayments / currentMonthPayments.length) * 100 : 0;

        // Calculate statistics for previous month
        const previousTotalRevenue = previousMonthPayments
             .filter(p => p.status === 'completed') // Only sum completed for revenue
            .reduce((sum, p) => sum + parseFloat(p.amount), 0);
        const previousTotalPayments = previousMonthPayments.filter(p => p.status === 'completed').length; // Only count completed payments
        const previousSuccessfulPayments = previousMonthPayments.filter(p => p.status === 'completed').length;
        const previousAverageAmount = previousMonthPayments.length > 0 ? previousTotalRevenue / previousMonthPayments.length : 0;
        const previousSuccessRate = previousMonthPayments.length > 0 ? (previousSuccessfulPayments / previousMonthPayments.length) * 100 : 0;

        // Calculate percentage changes
        const revenueChange = calculateChange(currentTotalRevenue, previousTotalRevenue);
        const paymentsChange = calculateChange(currentTotalPayments, previousTotalPayments);
        const averageAmountChange = calculateChange(currentAverageAmount, previousAverageAmount);
        const successRateChange = calculateChange(currentSuccessRate, previousSuccessRate);

        res.json({
            totalRevenue: Number(currentTotalRevenue.toFixed(2)),
            revenueChange: Number(Math.abs(revenueChange).toFixed(2)),
            revenuePositive: revenueChange >= 0,
            
            totalPayments: currentTotalPayments,
            paymentsChange: Number(Math.abs(paymentsChange).toFixed(2)),
            paymentsPositive: paymentsChange >= 0,

            averageAmount: Number(currentAverageAmount.toFixed(2)),
            averageAmountChange: Number(Math.abs(averageAmountChange).toFixed(2)),
            averageAmountPositive: averageAmountChange >= 0,

            successRate: Number(currentSuccessRate.toFixed(1)), // Keep one decimal for rate display
            successRateChange: Number(Math.abs(successRateChange).toFixed(2)),
            successRatePositive: successRateChange >= 0
        });

    } catch (error) {
        console.error('Error fetching revenue:', error);
        res.status(500).json({ error: 'Failed to fetch revenue data' });
    }
};

const updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate the status
        const allowedStatuses = ['completed', 'pending', 'failed'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment status provided'
            });
        }

        const payment = await Payment.findByPk(id);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        payment.status = status;
        await payment.save();

        res.json({
            success: true,
            message: 'Payment status updated successfully',
            data: payment
        });

    } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update payment status',
            error: error.message
        });
    }
};

module.exports = {
    getRevenue,
    getPayments,
    updatePaymentStatus
};
