import React from 'react';

const StatsCard = ({ label, value, change, positive }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
            <div className="flex flex-col">
                <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
                <span className="text-2xl font-semibold mt-2">{value}</span>
                {change !== undefined && (
                    <div className="flex items-center mt-2">
                        <span className={`text-sm ${positive ? 'text-green-500' : 'text-red-500'}`}>
                            {positive ? '↑' : '↓'} {change}%
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsCard;