import React, { useContext } from 'react';
import { ThemeProviderContext } from '../../contexts/theme-context.jsx';

const EventEditModal = ({ selectedItem, uniqueStatuses, handleCancel, confirmUpdate, setSelectedItem }) => {
  const { theme } = useContext(ThemeProviderContext);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className={`w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-lg p-6 shadow-lg ${theme.startsWith('dark') ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`mb-4 text-xl font-semibold ${theme.startsWith('dark') ? 'text-blue-300' : 'text-gray-800'}`}>Edit Event</h2>
        {/* Form fields */}
        <label className={`block ${theme.startsWith('dark') ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
        <input
          type="text"
          value={selectedItem.name || ''}
          onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })}
          className={`w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme.startsWith('dark') ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}`}
        />
        <label className={`block ${theme.startsWith('dark') ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
        <textarea
          value={selectedItem.description || ''}
          onChange={(e) => setSelectedItem({ ...selectedItem, description: e.target.value })}
          className={`w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme.startsWith('dark') ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}`}
        />
        <label className={`block ${theme.startsWith('dark') ? 'text-gray-300' : 'text-gray-700'}`}>Start Date</label>
        <input
          type="date"
          value={selectedItem.startDate ? new Date(selectedItem.startDate).toISOString().split('T')[0] : ''}
          onChange={(e) => setSelectedItem({ ...selectedItem, startDate: e.target.value ? new Date(e.target.value).toISOString() : '' })}
          className={`w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme.startsWith('dark') ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}`}
        />
        <label className={`block ${theme.startsWith('dark') ? 'text-gray-300' : 'text-gray-700'}`}>End Date</label>
        <input
          type="date"
          value={selectedItem.endDate ? new Date(selectedItem.endDate).toISOString().split('T')[0] : ''}
          onChange={(e) => setSelectedItem({ ...selectedItem, endDate: e.target.value ? new Date(e.target.value).toISOString() : '' })}
          className={`w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme.startsWith('dark') ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}`}
        />
        <label className={`block ${theme.startsWith('dark') ? 'text-gray-300' : 'text-gray-700'}`}>Location</label>
        <input
          type="text"
          value={selectedItem.location || ''}
          onChange={(e) => setSelectedItem({ ...selectedItem, location: e.target.value })}
          className={`w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme.startsWith('dark') ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}`}
        />
        <label className={`block ${theme.startsWith('dark') ? 'text-gray-300' : 'text-gray-700'}`}>Type</label>
        <input
          type="text"
          value={selectedItem.type || ''}
          onChange={(e) => setSelectedItem({ ...selectedItem, type: e.target.value })}
          className={`w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme.startsWith('dark') ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}`}
        />
        <label className={`block ${theme.startsWith('dark') ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
        <select
          value={selectedItem.status || ''}
          onChange={(e) => setSelectedItem({ ...selectedItem, status: e.target.value })}
          className={`w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme.startsWith('dark') ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}`}
        >
          {uniqueStatuses.map(status => (
            <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
          ))}
        </select>
        <label className={`block ${theme.startsWith('dark') ? 'text-gray-300' : 'text-gray-700'}`}>Participators</label>
        <input
          type="text"
          value={selectedItem.participators || ''}
          onChange={(e) => setSelectedItem({ ...selectedItem, participators: e.target.value })}
          className={`w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme.startsWith('dark') ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}`}
        />
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="isApproved"
            checked={selectedItem.isApproved}
            onChange={() => setSelectedItem({ ...selectedItem, isApproved: !selectedItem.isApproved })}
            className="mr-2"
          />
          <label htmlFor="isApproved" className={`text-gray-700 ${theme.startsWith('dark') ? 'text-gray-300' : ''}`}>Approved</label>
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={handleCancel}
            className={`rounded-lg px-4 py-2 transition ${theme.startsWith('dark') ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Cancel
          </button>
          <button
            onClick={confirmUpdate}
            disabled={!selectedItem.isApproved}
            className={`rounded-lg px-4 py-2 transition ${theme.startsWith('dark') ? 'bg-blue-700 text-white hover:bg-blue-800' : 'bg-blue-600 text-white hover:bg-blue-700'} ${!selectedItem.isApproved ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventEditModal;
