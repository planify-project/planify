import React, { useState } from 'react';
import { MdEdit } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';

const MAX_DESC_LENGTH = 60;

const EventRow = ({ item, theme, onEdit, onDelete, showImage }) => {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const isLongDesc = item.description && item.description.length > MAX_DESC_LENGTH;
  const shortDesc = isLongDesc ? item.description.slice(0, MAX_DESC_LENGTH) + '...' : item.description;

  return (
    <tr key={item.id} className={theme.startsWith('dark') ? 'hover:bg-gray-700 transition-colors' : 'hover:bg-green-50 transition-colors'}>
      {showImage && (
        <td className="px-6 py-4">
          {item.coverImage ? (
            <img
              src={item.coverImage}
              alt={item.name}
              className="w-12 h-12 object-cover rounded-md border border-gray-300"
            />
          ) : (
            <span className="text-gray-400">No Image</span>
          )}
        </td>
      )}
      <td className={theme.startsWith('dark') ? 'px-6 py-4 text-gray-100' : 'px-6 py-4 text-gray-800'}>{item.name}</td>
      <td className={theme.startsWith('dark') ? 'px-6 py-4 text-gray-300' : 'px-6 py-4 text-gray-700'}>
        <div>
          {showFullDesc ? (
            <>
              <span>{item.description}</span>
              <button
                className="ml-2 text-xs text-blue-500 underline cursor-pointer"
                onClick={() => setShowFullDesc(false)}
              >
                See less
              </button>
            </>
          ) : (
            <>
              <span>{shortDesc}</span>
              {isLongDesc && (
                <button
                  className="ml-2 text-xs text-blue-500 underline cursor-pointer"
                  onClick={() => setShowFullDesc(true)}
                >
                  See more
                </button>
              )}
            </>
          )}
        </div>
      </td>
      <td className={theme.startsWith('dark') ? 'px-6 py-4 text-gray-300' : 'px-6 py-4 text-gray-700'}>{item.startDate ? new Date(item.startDate).toLocaleString() : ''}</td>
      <td className={theme.startsWith('dark') ? 'px-6 py-4 text-gray-300' : 'px-6 py-4 text-gray-700'}>{item.endDate ? new Date(item.endDate).toLocaleString() : ''}</td>
      <td className={theme.startsWith('dark') ? 'px-6 py-4 text-gray-300' : 'px-6 py-4 text-gray-700'}>{item.location}</td>
      <td className={theme.startsWith('dark') ? 'px-6 py-4 text-gray-300' : 'px-6 py-4 text-gray-700'}>{item.type}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
          item.status === 'upcoming' ? (theme.startsWith('dark') ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700') :
          item.status === 'ongoing' ? (theme.startsWith('dark') ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-700') :
          item.status === 'completed' ? (theme.startsWith('dark') ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700') :
          item.status === 'approved' ? (theme.startsWith('dark') ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700') :
          item.status === 'pending' ? (theme.startsWith('dark') ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-700') :
          item.status === 'rejected' ? (theme.startsWith('dark') ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-600') :
          item.status === 'cancelled' ? (theme.startsWith('dark') ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700') :
          ''
        }`}>
          {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${item.isPublic ? (theme.startsWith('dark') ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700') : (theme.startsWith('dark') ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700')}`}>{item.isPublic ? 'Yes' : 'No'}</span>
      </td>
      <td className="px-6 py-4">
        <div className="inline-flex gap-3">
          <button
            onClick={() => onEdit(item)}
            className={theme.startsWith('dark') ? 'p-2 rounded-full hover:bg-blue-900 text-blue-300 transition' : 'p-2 rounded-full hover:bg-blue-100 text-blue-600 transition'}
            aria-label="Edit"
          >
            <MdEdit size={16} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className={theme.startsWith('dark') ? 'p-2 rounded-full hover:bg-red-900 text-red-300 transition' : 'p-2 rounded-full hover:bg-red-100 text-red-600 transition'}
            aria-label="Delete"
          >
            <FaTrash size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default EventRow;
