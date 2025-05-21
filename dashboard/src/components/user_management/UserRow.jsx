import React, { useContext } from "react";
import { FaLock, FaLockOpen, FaTrash } from "react-icons/fa";
import { ThemeProviderContext } from "../../contexts/theme-context";

const UserRow = ({ item, onEdit, onDelete, showImage }) => {
    const { theme } = useContext(ThemeProviderContext);
    return (
        <tr className={`transition-colors ${theme.startsWith("dark") ? "hover:bg-gray-700" : "hover:bg-green-50"}`}>
            {showImage && (
                <td className="px-6 py-4">
                    {item.image ? (
                        <img
                            src={item.image}
                            alt={item.name}
                            className="h-10 w-10 rounded-full border border-gray-300 object-cover"
                        />
                    ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-500">
                            N/A
                        </div>
                    )}
                </td>
            )}
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    <span className={theme.startsWith("dark") ? "text-gray-100" : "text-gray-800"}>{item.name}</span>
                </div>
            </td>
            <td className={theme.startsWith("dark") ? "px-6 py-4 text-gray-300" : "px-6 py-4 text-gray-700"}>{item.email}</td>
            <td className={theme.startsWith('dark') ? 'px-6 py-4 text-gray-300' : 'px-6 py-4 text-gray-700'}>
                <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                        item.isProvider
                            ? theme.startsWith('dark')
                                ? 'bg-blue-900 text-blue-300'
                                : 'bg-blue-100 text-blue-700'
                            : theme.startsWith('dark')
                                ? 'bg-gray-700 text-gray-300'
                                : 'bg-gray-100 text-gray-700'
                    }`}
                >
                    {item.isProvider ? 'Yes' : 'No'}
                </span>
            </td>
            <td className={theme.startsWith("dark") ? "px-6 py-4 text-gray-300" : "px-6 py-4 text-gray-700"}>
                <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                        item.isBanned
                            ? theme.startsWith("dark")
                                ? "bg-red-900 text-red-300"
                                : "bg-red-100 text-red-700"
                            : theme.startsWith("dark")
                              ? "bg-green-900 text-green-300"
                              : "bg-green-100 text-green-700"
                    }`}
                >
                    {item.isBanned ? "Yes" : "No"}
                </span>
            </td>
            <td className="flex items-center gap-3 px-6 py-4">
                <button
                    onClick={() => onEdit(item)}
                    className={`rounded-full p-2 transition ${theme.startsWith("dark") ? "text-blue-300 hover:bg-blue-900" : "text-blue-600 hover:bg-blue-100"}`}
                >
                    {item.isBanned ? <FaLockOpen size={16} /> : <FaLock size={16} />}
                </button>
                <button
                    onClick={() => onDelete(item.id)}
                    className={`rounded-full p-2 transition ${theme.startsWith("dark") ? "text-red-300 hover:bg-red-900" : "text-red-600 hover:bg-red-100"}`}
                >
                    <FaTrash size={16} />
                </button>
            </td>
        </tr>
    );
};

export default UserRow;
