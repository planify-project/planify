import React, { useContext, useState, useEffect } from "react";
import { ThemeProviderContext } from "../../contexts/theme-context";

const BanModal = ({ isOpen, user, onClose, onSave }) => {
  const { theme } = useContext(ThemeProviderContext);
  const [formUser, setFormUser] = useState(user || {});

  useEffect(() => {
    setFormUser(user || {});
  }, [user]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className={`w-full max-w-md rounded-lg p-6 shadow-lg ${theme.startsWith('dark') ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className={`mb-4 text-xl font-semibold ${theme.startsWith('dark') ? 'text-gray-100' : 'text-gray-800'}`}>Ban User</h2>
        <p className={`mb-6 ${theme.startsWith('dark') ? 'text-gray-300' : 'text-gray-600'}`}>Are you sure you want to ban this user?</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className={`rounded-lg px-4 py-2 transition ${theme.startsWith('dark') ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formUser)}
            className={`rounded-lg px-4 py-2 transition ${theme.startsWith('dark') ? 'bg-red-700 text-white hover:bg-red-800' : 'bg-red-600 text-white hover:bg-red-700'}`}
          >
            Ban User
          </button>
        </div>
      </div>
    </div>
  );
};

export default BanModal;
