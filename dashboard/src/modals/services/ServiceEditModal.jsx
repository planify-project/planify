import React, { useContext } from 'react';
import { ThemeProviderContext } from '../../contexts/theme-context';

const ServiceEditModal = ({ selectedItem, setSelectedItem, onCancel, onSave }) => {
  const { theme } = useContext(ThemeProviderContext);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className={`w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-lg p-6 shadow-lg ${theme.startsWith('dark') ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`mb-4 text-xl font-semibold ${theme.startsWith('dark') ? 'text-blue-300' : 'text-gray-800'}`}>Edit Service</h2>
        {/* Form fields */}
        <label className={`block ${theme.startsWith('dark') ? 'text-gray-300' : 'text-gray-700'}`}>Title</label>
        <input
          type="text"
          value={selectedItem.title}
          onChange={(e) => setSelectedItem({ ...selectedItem, title: e.target.value })}
          className={`w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme.startsWith('dark') ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}`}
        />
        <label className={`block ${theme.startsWith('dark') ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
        <textarea
          value={selectedItem.description}
          onChange={(e) => setSelectedItem({ ...selectedItem, description: e.target.value })}
          className={`w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme.startsWith('dark') ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}`}
        />
        <label className={`block ${theme.startsWith('dark') ? 'text-gray-300' : 'text-gray-700'}`}>Location</label>
        <input
          type="text"
          value={selectedItem.location}
          onChange={(e) => setSelectedItem({ ...selectedItem, location: e.target.value })}
          className={`w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 ${theme.startsWith('dark') ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-gray-900 border-gray-300'}`}
        />
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className={`rounded-lg px-4 py-2 transition ${theme.startsWith('dark') ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className={`rounded-lg px-4 py-2 transition ${theme.startsWith('dark') ? 'bg-green-700 text-white hover:bg-green-800' : 'bg-green-600 text-white hover:bg-green-700'}`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceEditModal;
