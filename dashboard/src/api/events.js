import axios from "axios";

export const fetchEventStats = async () => {
    try {
        // Get current and previous month date ranges
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        // Count events for current month
        const currentRes = await axios.get(
            `http://localhost:3000/api/events/getAll?startDate=${currentMonthStart.toISOString()}&endDate=${nextMonthStart.toISOString()}`
        );
        const currentCount = currentRes.data.total;

        // Count events for previous month
        const previousRes = await axios.get(
            `http://localhost:3000/api/events/getAll?startDate=${previousMonthStart.toISOString()}&endDate=${currentMonthStart.toISOString()}`
        );
        const previousCount = previousRes.data.total;

        // Get total events (all time)
        const totalRes = await axios.get('http://localhost:3000/api/events/getAll?page=1&limit=1');
        const totalEvents = totalRes.data.total;

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

        return {
            totalEvents,
            change: parseFloat(change.toFixed(2)),
            positive
        };
    } catch (err) {
        return { totalEvents: 0, change: 0, positive: true };
    }
};
