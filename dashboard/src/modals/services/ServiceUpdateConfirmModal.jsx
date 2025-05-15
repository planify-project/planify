import React, { useContext } from 'react';
import { ThemeProviderContext } from '../../contexts/theme-context';

const ServiceUpdateConfirmModal = ({ onBack, onConfirm }) => {
  const { theme } = useContext(ThemeProviderContext);
  return (
    <>
      <h2 className={`text-xl font-semibold mb-4 ${theme.startsWith('dark') ? 'text-blue-300' : 'text-gray-800'}`}>Update Confirmation</h2>
      <div>
        <p className={theme.startsWith('dark') ? 'text-gray-300 mb-6' : 'text-gray-600 mb-6'}>
          Are you sure you want to update this item? This will apply all changes you've made.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onBack}
            className={`px-4 py-2 rounded-lg transition ${theme.startsWith('dark') ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Back
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg transition ${theme.startsWith('dark') ? 'bg-green-700 text-white hover:bg-green-800' : 'bg-green-600 text-white hover:bg-green-700'}`}
          >
            Confirm Update
          </button>
        </div>
      </div>
    </>
  );
};

export default ServiceUpdateConfirmModal;
