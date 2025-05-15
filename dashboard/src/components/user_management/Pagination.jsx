import React, { useContext } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { ThemeProviderContext } from "../../contexts/theme-context";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const { theme } = useContext(ThemeProviderContext);
  return (
    <div className={`flex items-center justify-between p-4  }`}>
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className={`rounded px-3 py-1 disabled:opacity-50 ${theme.startsWith('dark') ? 'bg-gray-700 text-blue-300 hover:bg-gray-600' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
      >
        <FaArrowLeft size={16} />
      </button>

      <div className="flex items-center gap-2">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => onPageChange(index + 1)}
            className={`rounded px-3 py-1 ${
              currentPage === index + 1
                ? theme.startsWith('dark')
                  ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white'
                : theme.startsWith('dark')
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className={`rounded px-3 py-1 disabled:opacity-50 ${theme.startsWith('dark') ? 'bg-gray-700 text-blue-300 hover:bg-gray-600' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
      >
        <FaArrowRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;