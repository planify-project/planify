import React from 'react';
import EventRow from './EventRow';

const EventTable = ({ items, theme, onEdit, onDelete }) => {
  return (
    <div className={`overflow-x-auto rounded-xl shadow-md ${theme.startsWith('dark') ? 'bg-gray-800' : 'bg-white'}`}>
      <table className={`min-w-full divide-y ${theme.startsWith('dark') ? 'divide-gray-700' : 'divide-gray-200'}`}>
        <thead className={theme.startsWith('dark') ? 'bg-gray-700 text-blue-300' : 'bg-blue-100 text-blue-800'}>
          <tr>
            <th className="px-6 py-4 text-left font-semibold">Name</th>
            <th className="px-6 py-4 text-left font-semibold">Description</th>
            <th className="px-6 py-4 text-left font-semibold">Start Date</th>
            <th className="px-6 py-4 text-left font-semibold">End Date</th>
            <th className="px-6 py-4 text-left font-semibold">Location</th>
            <th className="px-6 py-4 text-left font-semibold">Type</th>
            <th className="px-6 py-4 text-left font-semibold">Status</th>
            <th className="px-6 py-4 text-left font-semibold">Public</th>
            <th className="px-6 py-4 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className={theme.startsWith('dark') ? 'divide-y divide-gray-700' : 'divide-y divide-gray-100'}>
          {items.length > 0 ? (
            items.map((item) => (
              <EventRow key={item.id} item={item} theme={theme} onEdit={onEdit} onDelete={onDelete} />
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center py-6 text-gray-500">
                No events available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;
