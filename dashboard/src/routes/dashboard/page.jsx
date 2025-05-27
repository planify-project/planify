import React, { useContext, useEffect, useState } from "react";
import StatsCard from "../../components/dashboard/StatsCard";
import ProductSalesChart from "../../components/dashboard/ProductSalesChart";
import ProductCategoryPie from "../../components/dashboard/ProductCategoryPie";
import { ThemeProviderContext } from "../../contexts/theme-context";
import { API_BASE } from "../../configs/url";
import axios from "axios";

const Dashboard = () => {
    const { theme } = useContext(ThemeProviderContext);
    const [userStats, setUserStats] = useState({
        totalCustomers: 0,
        change: 0,
        positive: true,
    });

    const [orderStats, setOrderStats] = useState({
        total: 0,
        change: 0,
        positive: true,
    });

    const [revenueStats, setRevenueStats] = useState({
        total: 0,
        change: 0,
        positive: true,
    });

    const [months, setMonths] = useState(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]);
    const [privateEvents, setPrivateEvents] = useState(Array(12).fill(0));
    const [publicEvents, setPublicEvents] = useState(Array(12).fill(0));

    const [eventStatus, setEventStatus] = useState(["pending", "approved", "rejected", "cancelled", "completed"]);
    const [eventStatusValues, setEventStatusValues] = useState([0, 0, 0, 0, 0]);
    const eventStatusColor = ["#845EC2", "#D65DB1", "#FF6F91", "#FF9671", "#FFC75F"];

    useEffect(() => {
        getStats();
        getOrderStats();
        getRevenueStats();
        fetchEventsByMonth();
        fetchEventStatusDistribution();
    }, []);

    const getStats = async () => {
        try {
            const res = await axios.get(`${API_BASE}/users/traffic/monthly`);
            setUserStats({
                totalCustomers: res.data.totalCustomers || 0,
                change: res.data.change || 0,
                positive: res.data.positive ?? true,
            });
        } catch (err) {
            console.error("Error fetching user stats:", err);
            setUserStats({ totalCustomers: 0, change: 0, positive: true });
        }
    };

    const getOrderStats = async () => {
        try {
            const res = await axios.get(`${API_BASE}/events/events-this-month`);
            setOrderStats({
                total: res.data.total || 0,
                change: res.data.change || 0,
                positive: res.data.positive ?? true,
            });
        } catch (err) {
            console.error("Error fetching order stats:", err);
            setOrderStats({ total: 0, change: 0, positive: true });
        }
    };

    const getRevenueStats = async () => {
        try {
            const res = await axios.get(`${API_BASE}/payments/revenue`);
            setRevenueStats({
                total: res.data.totalRevenue || 0,
                change: res.data.revenueChange || 0,
                positive: res.data.revenuePositive ?? true,
            });
        } catch (err) {
            console.error("Error fetching revenue stats:", err);
            setRevenueStats({ total: 0, change: 0, positive: true });
        }
    };

    const fetchEventsByMonth = async () => {
        try {
            const [privRes, pubRes] = await Promise.all([
                axios.get(`${API_BASE}/events/private-events-this-year`),
                axios.get(`${API_BASE}/events/public-events-this-year`)
            ]);
            const privData = privRes.data;
            const pubData = pubRes.data;
            const privCounts = Array(12).fill(0);
            privData.months?.forEach(e => {
                const d = new Date(e.month);
                privCounts[d.getMonth()] = e.count || 0;
            });
            const pubCounts = Array(12).fill(0);
            pubData.months?.forEach(e => {
                const d = new Date(e.month);
                pubCounts[d.getMonth()] = e.count || 0;
            });
            setPrivateEvents(privCounts);
            setPublicEvents(pubCounts);
        } catch (err) {
            console.error("Error fetching events by month:", err);
        }
    };

    const fetchEventStatusDistribution = async () => {
        try {
            const res = await axios.get(`${API_BASE}/events/event-status-distribution`);
            const data = res.data;
            const statuses = ["pending", "approved", "rejected", "cancelled", "completed"];
            const values = statuses.map(status => {
                const found = data?.find(d => d.status === status);
                return found?.count || 0;
            });
            setEventStatus(statuses);
            setEventStatusValues(values);
        } catch (err) {
            console.error("Error fetching event status distribution:", err);
        }
    };

    const stats = [
        { label: "Total customers", value: (userStats.totalCustomers || 0).toLocaleString(), change: userStats.change || 0, positive: userStats.positive },
        { label: "Total revenue", value: `${(revenueStats.total || 0).toLocaleString()} د.ت`, change: revenueStats.change || 0, positive: revenueStats.positive },
        { label: "Total events", value: (orderStats.total || 0).toLocaleString(), change: orderStats.change || 0, positive: orderStats.positive },
        { label: "Total returns", value: "1,789", change: 0.12, positive: true },
    ];

    const countries = [
        { name: "Poland", percent: 19 },
        { name: "Austria", percent: 15 },
        { name: "Spain", percent: 13 },
        { name: "Romania", percent: 12 },
        { name: "France", percent: 11 },
        { name: "Italy", percent: 11 },
        { name: "Germany", percent: 10 },
        { name: "Ukraine", percent: 9 },
    ];

    return (
        <div className={`space-y-6 p-6 ${theme.startsWith("dark") ? "bg-gray-900 text-white" : "bg-[#f5f9f6] text-gray-900"}`}>
            <h1 className="text-2xl font-semibold">Dashboard</h1>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="grid grid-cols-2 gap-4">
                    {stats.map((s, idx) => (
                        <StatsCard
                            key={idx}
                            {...s}
                        />
                    ))}
                </div>
                <div className={`${theme.startsWith("dark") ? "bg-gray-800" : "bg-white"} rounded-xl p-4 shadow`}>
                    <h4 className="mb-4 font-semibold">Events (public/private)</h4>
                    <ProductSalesChart
                        labels={months}
                        privateEvents={privateEvents}
                        publicEvents={publicEvents}
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className={`${theme.startsWith("dark") ? "bg-gray-800" : "bg-white"} rounded-xl p-4 shadow`}>
                    <h4 className="mb-4 font-semibold">Sales by product category</h4>
                    <ProductCategoryPie
                        labels={eventStatus}
                        values={eventStatusValues}
                        colors={eventStatusColor}
                    />
                </div>

                {/* <SalesByCountry countries={countries} /> */}
            </div>
        </div>
    );
};

export default Dashboard;
