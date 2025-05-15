import React, { useContext } from 'react';
import { ThemeProviderContext } from '../../contexts/theme-context.jsx';

const EventUpdateConfirmModal = ({ handleUpdate, setModalMode }) => {
  const { theme } = useContext(ThemeProviderContext);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className={`w-full max-w-md rounded-lg p-6 shadow-lg ${theme.startsWith('dark') ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`mb-4 text-xl font-semibold ${theme.startsWith('dark') ? 'text-blue-300' : 'text-gray-800'}`}>Update Confirmation</h2>
        <p className={`text-gray-300 mb-6 ${theme.startsWith('dark') ? 'text-gray-300' : ''}`}>
          Are you sure you want to update this event? This will apply all changes you've made.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setModalMode('edit')}
            className={`rounded-lg px-4 py-2 transition ${theme.startsWith('dark') ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Back
          </button>
          <button
            onClick={handleUpdate}
            className={`rounded-lg px-4 py-2 transition ${theme.startsWith('dark') ? 'bg-blue-700 text-white hover:bg-blue-800' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            Confirm Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventUpdateConfirmModal;
