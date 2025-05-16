import React, { useContext } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { ThemeProviderContext } from "../../contexts/theme-context";

const getPageNumbers = (currentPage, totalPages, maxVisible = 11) => {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages = [];
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, currentPage + half);

  if (start === 1) {
    end = maxVisible;
  } else if (end === totalPages) {
    start = totalPages - maxVisible + 1;
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  if (start > 2) pages.unshift('...');
  if (start > 1) pages.unshift(1);
  if (end < totalPages - 1) pages.push('...');
  if (end < totalPages) pages.push(totalPages);
  return pages;
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const { theme } = useContext(ThemeProviderContext);
  const pageNumbers = getPageNumbers(currentPage, totalPages);
  return (
    <div className="p-4 flex justify-between items-center ">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className={theme.startsWith('dark') ? 'px-3 py-1 bg-blue-900 text-blue-200 rounded disabled:opacity-50' : 'px-3 py-1 bg-blue-100 text-blue-700 rounded disabled:opacity-50'}
      >
        {'<'}
      </button>
      <div className="flex gap-2 items-center">
        {pageNumbers.map((num, idx) =>
          num === '...'
            ? <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
            : (
              <button
                key={num}
                onClick={() => onPageChange(num)}
                className={`px-3 py-1 rounded ${
                  currentPage === num
                    ? theme.startsWith('dark')
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-600 text-white'
                    : theme.startsWith('dark')
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {num}
              </button>
            )
        )}
      </div>
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className={theme.startsWith('dark') ? 'px-3 py-1 bg-blue-900 text-blue-200 rounded disabled:opacity-50' : 'px-3 py-1 bg-blue-100 text-blue-700 rounded disabled:opacity-50'}
      >
        {'>'}
      </button>
    </div>
  );
};

export default Pagination;