import React, { useContext } from "react";
import { ThemeProviderContext } from "../../contexts/theme-context";

const SalesByCountry = ({ countries }) => {
  const { theme } = useContext(ThemeProviderContext);
  return (
    <div className={`${theme.startsWith('dark') ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-4 rounded-xl shadow`}>
      <h4 className="font-semibold mb-2">Sales by countries</h4>
      <ul className="text-sm space-y-1">
        {countries.map(({ name, percent }) => (
          <li key={name} className="flex justify-between">
            <span>{name}</span>
            <span>{percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SalesByCountry;
