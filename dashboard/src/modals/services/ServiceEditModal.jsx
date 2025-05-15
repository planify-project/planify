import React, { useContext } from 'react';
import { ThemeProviderContext } from '../../contexts/theme-context';

const ServiceEditModal = ({ selectedItem, setSelectedItem, onCancel, onSave }) => {
  const { theme } = useContext(ThemeProviderContext);
  return (
    <>
      <h2 className={`text-xl font-semibold mb-4 ${theme.startsWith('dark') ? 'text-blue-300' : 'text-gray-800'}`}>Edit Item</h2>
      <div>
        <label className={theme.startsWith('dark') ? 'block text-gray-300' : 'block text-gray-700'}>Title</label>
        <input
          type="text"
          value={selectedItem.title}
          onChange={(e) => setSelectedItem({ ...selectedItem, title: e.target.value })}
          className={`w-full p-2 border rounded mb-4 ${theme.startsWith('dark') ? 'bg-gray-700 text-white' : ''}`}
        />
        <label className={theme.startsWith('dark') ? 'block text-gray-300' : 'block text-gray-700'}>Description</label>
        <textarea
          value={selectedItem.description}
          onChange={(e) => setSelectedItem({ ...selectedItem, description: e.target.value })}
          className={`w-full p-2 border rounded mb-4 ${theme.startsWith('dark') ? 'bg-gray-700 text-white' : ''}`}
        />
        <label className={theme.startsWith('dark') ? 'block text-gray-300' : 'block text-gray-700'}>Location</label>
        <input
          type="text"
          value={selectedItem.location}
          onChange={(e) => setSelectedItem({ ...selectedItem, location: e.target.value })}
          className={`w-full p-2 border rounded mb-4 ${theme.startsWith('dark') ? 'bg-gray-700 text-white' : ''}`}
        />
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className={`px-4 py-2 rounded-lg transition ${theme.startsWith('dark') ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className={`px-4 py-2 rounded-lg transition ${theme.startsWith('dark') ? 'bg-green-700 text-white hover:bg-green-800' : 'bg-green-600 text-white hover:bg-green-700'}`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
};

export default ServiceEditModal;
