import React, { useContext } from "react";
import UserRow from "./UserRow";
import { ThemeProviderContext } from "../../contexts/theme-context";

const UserTable = ({ items, onEdit, onDelete }) => {
  const { theme } = useContext(ThemeProviderContext);
  return (
    <div className={`overflow-x-auto rounded-xl shadow-md ${theme.startsWith('dark') ? 'bg-gray-800' : 'bg-white'}`}>
      <table className={`min-w-full divide-y ${theme.startsWith('dark') ? 'divide-gray-700' : 'divide-gray-200'}`}>
        <thead className={theme.startsWith('dark') ? 'bg-gray-700 text-blue-300' : 'bg-blue-100 text-blue-800'}>
          <tr>
            <th className="px-6 py-4 text-left font-semibold">Name</th>
            <th className="px-6 py-4 text-left font-semibold">Email</th>
            <th className="px-6 py-4 text-left font-semibold">Provider</th>
            <th className="px-6 py-4 text-left font-semibold">Band</th>
            <th className="px-6 py-4 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className={`divide-y ${theme.startsWith('dark') ? 'divide-gray-700' : 'divide-gray-100'}`}>
          {items.map((item) => (
            <UserRow
              key={item.id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;