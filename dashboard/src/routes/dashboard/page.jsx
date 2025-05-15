import React from "react";
import { useTheme } from "@/hooks/use-theme";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";
import PieChart from "@/components/charts/PieChart";

const DashboardPage = () => {
    const { theme } = useTheme();
    const pieLabels = ["Donors", "Recipients", "Volunteers"];
  const pieData = [120, 90, 60];

  const lineLabels = ["Jan", "Feb", "Mar", "Apr", "May"];
  const lineData = [30, 45, 60, 40, 75];

    return (
        <div className={`min-h-screen p-6 ${theme.startsWith('dark') ? 'bg-gray-900' : 'bg-[#f5f9f6]'}`}>
            <h1 className={`text-3xl font-bold mb-8 ${theme.startsWith('dark') ? 'text-blue-300' : 'text-green-700'}`}>Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-center">
                    <h2 className={`text-lg font-semibold mb-4 ${theme.startsWith('dark') ? 'text-blue-200' : 'text-green-700'}`}>Bar Chart</h2>
                    <BarChart theme={theme} />
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-center">
                    <h2 className={`text-lg font-semibold mb-4 ${theme.startsWith('dark') ? 'text-blue-200' : 'text-green-700'}`}>Line Chart</h2>
                    <LineChart theme={theme} labels={lineLabels} dataValues={lineData} title="Monthly Donations"  />
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col items-center">
                    <h2 className={`text-lg font-semibold mb-4 ${theme.startsWith('dark') ? 'text-blue-200' : 'text-green-700'}`}>Pie Chart</h2>
                    <PieChart theme={theme} labels={pieLabels} dataValues={pieData} title="User Roles Distribution" />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
