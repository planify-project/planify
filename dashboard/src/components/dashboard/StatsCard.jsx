import React, { useContext } from "react";
import { ThemeProviderContext } from "../../contexts/theme-context";

const StatsCard = ({ label, value, change, positive }) => {
  const { theme } = useContext(ThemeProviderContext);
  return (
    <div className={`${theme.startsWith('dark') ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-4 rounded-xl shadow text-center `}>
      <p className="text-gray-500 text-sm dark:text-gray-400 text-center">{label}</p>
      <h3 className="text-xl font-semibold">{value}</h3>
      <p className={`text-sm ${positive ? "text-green-500" : "text-red-500"}`}>{change}%</p>
    </div>
  );
};

export default StatsCard;