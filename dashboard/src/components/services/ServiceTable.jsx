import React, { useContext } from 'react';
import ServiceRow from './ServiceRow';
import { ThemeProviderContext } from '../../contexts/theme-context';

const ServiceTable = ({ items, onEdit, onDelete, navigate, showPrice, showServiceType, showImage }) => {
  const { theme } = useContext(ThemeProviderContext);
  return (
    <div className={`overflow-x-auto rounded-xl shadow-md ${theme.startsWith('dark') ? 'bg-gray-800' : 'bg-white'}`}>
      <table className={`min-w-full divide-y ${theme.startsWith('dark') ? 'divide-gray-700' : 'divide-gray-200'}`}>
        <thead className={theme.startsWith('dark') ? 'bg-gray-700 text-blue-300' : 'bg-blue-100 text-blue-800'}>
          <tr>
            {showImage && <th className="px-6 py-4 text-left font-semibold">Image</th>}
            <th className="px-6 py-4 text-left font-semibold">Title</th>
            <th className="px-6 py-4 text-left font-semibold">Description</th>
            {showPrice && <th className="px-6 py-4 text-left font-semibold">Price</th>}
            {showServiceType && <th className="px-6 py-4 text-left font-semibold">Type</th>}
            <th className="px-6 py-4 text-left font-semibold">Location</th>
            <th className="px-6 py-4 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className={theme.startsWith('dark') ? 'divide-y divide-gray-700' : 'divide-y divide-gray-100'}>
          {items.length > 0 ? (
            items.map((item) => (
              <ServiceRow
                key={item.id}
                item={item}
                onEdit={onEdit}
                onDelete={onDelete}
                navigate={navigate}
                showPrice={showPrice}
                showServiceType={showServiceType}
                showImage={showImage}
              />
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-6 text-gray-500">
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceTable;
