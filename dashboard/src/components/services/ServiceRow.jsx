import React, { useContext } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { ThemeProviderContext } from '../../contexts/theme-context';

const ServiceRow = ({ item, onEdit, onDelete, navigate, showPrice, showServiceType, showImage }) => {
  const { theme } = useContext(ThemeProviderContext);
  return (
    <tr className={theme.startsWith('dark') ? 'hover:bg-gray-700 transition-colors' : 'hover:bg-green-50 transition-colors'}>
      {showImage && (
        <td className="px-6 py-4">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-12 h-12 object-cover rounded-md border border-gray-300"
            />
          ) : (
            <span className="text-gray-400">No Image</span>
          )}
        </td>
      )}
      <td className="px-6 py-4">
        <div
          onClick={() => navigate(`/manage-inneed/${item.id}`)}
          className="flex items-center gap-3 cursor-pointer hover:underline"
        >
          <span className={theme.startsWith('dark') ? 'text-gray-100' : 'text-gray-800'}>{item.title}</span>
        </div>
      </td>
      <td className={theme.startsWith('dark') ? 'px-6 py-4 text-gray-300' : 'px-6 py-4 text-gray-700'}>{item.description}</td>
      {showPrice && (
        <td className={theme.startsWith('dark') ? 'px-6 py-4 text-gray-300' : 'px-6 py-4 text-gray-700'}>
          {item.price ? `$${Number(item.price).toFixed(2)}` : '-'}
        </td>
      )}
      {showServiceType && (
        <td className={theme.startsWith('dark') ? 'px-6 py-4 text-gray-300 capitalize' : 'px-6 py-4 text-gray-700 capitalize'}>
          {item.serviceType || 'general'}
        </td>
      )}
      <td className={theme.startsWith('dark') ? 'px-6 py-4 text-gray-300' : 'px-6 py-4 text-gray-700'}>{item.location}</td>
      <td className="px-6 py-4 flex gap-3 items-center">
        <button
          onClick={() => onEdit(item)}
          className={theme.startsWith('dark') ? 'p-2 rounded-full hover:bg-blue-900 text-blue-300 transition' : 'p-2 rounded-full hover:bg-blue-100 text-blue-600 transition'}
        >
          <FaEdit size={16} />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className={theme.startsWith('dark') ? 'p-2 rounded-full hover:bg-red-900 text-red-300 transition' : 'p-2 rounded-full hover:bg-red-100 text-red-600 transition'}
        >
          <FaTrash size={16} />
        </button>
      </td>
    </tr>
  );
};

export default ServiceRow;
