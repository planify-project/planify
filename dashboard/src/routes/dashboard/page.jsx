import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import StatsCard from "../../components/dashboard/StatsCard";
import ProductSalesChart from "../../components/dashboard/ProductSalesChart";
import ProductCategoryPie from "../../components/dashboard/ProductCategoryPie";
import SalesByCountry from "../../components/dashboard/SalesByCountry";
import { ThemeProviderContext } from "../../contexts/theme-context";
import { fetchUserStats } from "../../api/user";

const Dashboard = () => {
    const { theme } = useContext(ThemeProviderContext);
    const [userStats, setUserStats] = useState({
        totalCustomers: 0,
        change: 0,
        positive: true,
    });

    useEffect(() => {
        getStats();
    }, []);
    
    const getStats = async () => {
        try {
            const data = await fetchUserStats();
            setUserStats({
                totalCustomers: data.totalCustomers,
                change: data.change,
                positive: data.positive,
            });
        } catch (err) {
            setUserStats({ totalCustomers: 0, change: 0, positive: true });
        }
    };
    const stats = [
        { label: "Total customers", value: userStats.totalCustomers.toLocaleString(), change: userStats.change, positive: userStats.positive },
        { label: "Total revenue", value: "3,465 M د.ت", change: 0.5, positive: true },
        { label: "Total orders", value: "1,136 M", change: -0.2, positive: false },
        { label: "Total returns", value: "1,789", change: 0.12, positive: true },
    ];

    const salesLabels = ["1 Jul", "2 Jul", "3 Jul", "4 Jul", "5 Jul", "6 Jul", "7 Jul", "8 Jul", "9 Jul", "10 Jul", "11 Jul", "12 Jul"];
    const grossMargin = [25, 35, 30, 45, 50, 52, 20, 33, 37, 40, 48, 60];
    const revenue = [40, 48, 58, 33, 27, 62, 29, 38, 42, 52, 55, 66];

    const productLabels = ["Living room", "Kids", "Office", "Bedroom", "Kitchen", "Bathroom", "Dining room", "Decor", "Lighting", "Outdoor"];
    const productValues = [25, 17, 13, 12, 9, 8, 6, 5, 3, 2];
    const productColors = ["#845EC2", "#D65DB1", "#FF6F91", "#FF9671", "#FFC75F", "#F9F871", "#2C73D2", "#0089BA", "#008E9B", "#008F7A"];

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
                    <h4 className="mb-4 font-semibold">Product sales</h4>
                    <ProductSalesChart
                        labels={salesLabels}
                        grossMargin={grossMargin}
                        revenue={revenue}
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className={`${theme.startsWith("dark") ? "bg-gray-800" : "bg-white"} rounded-xl p-4 shadow`}>
                    <h4 className="mb-4 font-semibold">Sales by product category</h4>
                    <ProductCategoryPie
                        labels={productLabels}
                        values={productValues}
                        colors={productColors}
                    />
                </div>

                <SalesByCountry countries={countries} />
            </div>
        </div>
    );
};

export default Dashboard;
