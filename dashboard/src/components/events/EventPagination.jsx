import React from 'react';

const EventPagination = ({ currentPage, totalPages, setCurrentPage, theme }) => (
  <div className="p-4 flex justify-between items-center ">
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      disabled={currentPage === 1}
      className={theme.startsWith('dark') ? 'px-3 py-1 bg-blue-900 text-blue-300 rounded disabled:opacity-50' : 'px-3 py-1 bg-blue-100 text-blue-700 rounded disabled:opacity-50'}
    >
      {'<'}
    </button>
    <div className="flex gap-2 items-center">
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentPage(index + 1)}
          className={`px-3 py-1 rounded ${
            currentPage === index + 1
              ? theme.startsWith('dark')
                ? 'bg-blue-700 text-white'
                : 'bg-blue-600 text-white'
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
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      disabled={currentPage === totalPages}
      className={theme.startsWith('dark') ? 'px-3 py-1 bg-blue-900 text-blue-300 rounded disabled:opacity-50' : 'px-3 py-1 bg-blue-100 text-blue-700 rounded disabled:opacity-50'}
    >
      {'>'}
    </button>
  </div>
);

export default EventPagination;
