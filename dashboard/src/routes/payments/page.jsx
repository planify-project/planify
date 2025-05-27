import React, { useContext, useEffect, useState } from "react";
import { ThemeProviderContext } from "../../contexts/theme-context";
import { API_BASE } from "../../configs/url";
import axios from "axios";
import StatsCard from "../../components/dashboard/StatsCard";
import PaymentPagination from "../../components/payments/PaymentPagination";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table";

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

const PaymentsPage = () => {
    const { theme } = useContext(ThemeProviderContext);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalPayments: 0,
        averageAmount: 0,
        successRate: 0
    });

    useEffect(() => {
        fetchPayments();
        fetchStats();
    }, []);

    const fetchPayments = async () => {
        try {
            const response = await axios.get(`${API_BASE}/payments`);
            setPayments(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching payments:", error);
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get(`${API_BASE}/payments/revenue`);
            const statsData = response.data;
            
            setStats({
                totalRevenue: statsData.totalRevenue,
                totalPayments: statsData.totalPayments,
                averageAmount: statsData.averageAmount,
                successRate: statsData.successRate,
                revenueChange: statsData.revenueChange,
                revenuePositive: statsData.revenuePositive,
                paymentsChange: statsData.paymentsChange,
                paymentsPositive: statsData.paymentsPositive,
                averageAmountChange: statsData.averageAmountChange,
                averageAmountPositive: statsData.averageAmountPositive,
                successRateChange: statsData.successRateChange,
                successRatePositive: statsData.successRatePositive,
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const handleStatusChange = async (paymentId, newStatus) => {
        try {
            console.log(`Attempting to update payment ${paymentId} status to ${newStatus}`);
            const response = await axios.put(`${API_BASE}/payments/${paymentId}/status`, { status: newStatus });
            console.log('Update status API response:', response.data);
            // Update the payments state with the new status
            setPayments(payments.map(payment => 
                payment.id === paymentId ? { ...payment, status: newStatus } : payment
            ));
            // Refetch stats after successful status update
            await fetchStats();
            console.log(`Payment ${paymentId} status updated in frontend state to ${newStatus}`);
        } catch (error) {
            console.error(`Error updating payment ${paymentId} status to ${newStatus}:`, error);
            // Optionally, show an error message to the user
        }
    };

    const statsCards = [
        {
            label: "Total Revenue",
            value: `${stats.totalRevenue.toLocaleString()} د.ت`,
            change: stats.revenueChange,
            positive: stats.revenuePositive
        },
        {
            label: "Total Payments",
            value: stats.totalPayments.toLocaleString(),
            change: stats.paymentsChange,
            positive: stats.paymentsPositive
        },
        {
            label: "Average Amount",
            value: `${stats.averageAmount.toFixed(2)} د.ت`,
            change: stats.averageAmountChange,
            positive: stats.averageAmountPositive
        },
        {
            label: "Success Rate",
            value: `${stats.successRate.toFixed(1)}%`,
            change: stats.successRateChange,
            positive: stats.successRatePositive
        }
    ];

    // Calculate pagination
    const totalPages = Math.ceil(payments.length / itemsPerPage);
    const currentItems = payments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className={`space-y-6 p-6 ${theme.startsWith("dark") ? "bg-gray-900 text-white" : "bg-[#f5f9f6] text-gray-900"}`}>
            <h1 className="text-2xl font-semibold">Payments</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statsCards.map((stat, idx) => (
                    <StatsCard key={idx} {...stat} />
                ))}
            </div>

            {/* Payments Table */}
            <div className={`${theme.startsWith("dark") ? "bg-gray-800" : "bg-white"} rounded-xl p-4 shadow`}>
                <h2 className="text-xl font-semibold mb-4">Recent Payments</h2>
                {loading ? (
                    <div className="text-center py-4">Loading...</div>
                ) : (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentItems.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell>
                                            {formatDate(payment.created_at)}
                                        </TableCell>
                                        <TableCell>{payment.userName}</TableCell>
                                        <TableCell>{Number(payment.amount).toFixed(2)} د.ت</TableCell>
                                        <TableCell className="capitalize">{payment.method}</TableCell>
                                        <TableCell>
                                            <select 
                                                value={payment.status}
                                                onChange={(e) => handleStatusChange(payment.id, e.target.value)}
                                                className={`px-2 py-1 rounded-full text-xs ${ 
                                                    payment.status === 'completed' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : payment.status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                } focus:outline-none`}
                                            >
                                                <option value="completed">completed</option>
                                                <option value="pending">pending</option>
                                                <option value="failed">failed</option>
                                            </select>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <PaymentPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            setCurrentPage={setCurrentPage}
                            theme={theme}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentsPage;
