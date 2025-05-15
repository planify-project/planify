import React, { useEffect, useState, useContext } from 'react';
import { ThemeProviderContext } from '../../contexts/theme-context';
import EventTable from '../../components/events/EventTable';
import EventPagination from '../../components/events/EventPagination';
import EventEditModal from '../../modals/events/EventEditModal';
import EventUpdateConfirmModal from '../../modals/events/EventUpdateConfirmModal';
import EventDeleteModal from '../../modals/events/EventDeleteModal';
import axios from 'axios';

const Events = () => {
  const { theme } = useContext(ThemeProviderContext);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalMode, setModalMode] = useState('');

  const [locationFilter, setLocationFilter] = useState('');
  const [approvedFilter, setApprovedFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/events/getAll');
      console.log(res.data);
      const sortedData = res.data.events.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
      setData(sortedData);
      setTotalPages(Math.ceil(sortedData.length / itemsPerPage));
    } catch (err) {
      console.log('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const confirmDelete = (id) => {
    setDeleteId(id);
    setModalMode('delete');
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/event/${deleteId}`);
      setData(data.filter(item => item.id !== deleteId));
      setShowModal(false);
      setDeleteId(null);
      setModalMode('');
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setDeleteId(null);
    setSelectedItem(null);
    setModalMode('');
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setModalMode('edit');
    setShowModal(true);
  };

  const confirmUpdate = () => {
    setModalMode('update-confirm');
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3000/api/event/${selectedItem.id}`, selectedItem);
      setData(data.map(item => (item.id === selectedItem.id ? selectedItem : item)));
      setShowModal(false);
      setSelectedItem(null);
      setModalMode('');
    } catch (error) {
      console.log('Error updating data:', error);
    }
  };

  const uniqueLocations = [...new Set(data.map(item => item.location))];
  const uniqueStatuses = ['upcoming', 'ongoing', 'completed'];

  const filteredData = data
    .filter((item) =>
      (item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (locationFilter ? item.location === locationFilter : true) &&
      (approvedFilter ? item.isApproved === (approvedFilter === 'true') : true) &&
      (statusFilter ? item.status === statusFilter : true)
    );

  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className={`min-h-screen p-6 ${theme.startsWith('dark') ? 'bg-gray-900' : 'bg-[#f5f9f6]'}`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-3xl font-bold mb-6 ${theme.startsWith('dark') ? 'text-blue-300' : 'text-blue-700'}`}>Events</h1>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none shadow-sm transition ${theme.startsWith('dark') ? 'bg-gray-800 text-white focus:ring-2 focus:ring-blue-400' : 'focus:ring-2 focus:ring-blue-400'}`}
          />
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Locations</option>
              {uniqueLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <select
              value={approvedFilter}
              onChange={(e) => setApprovedFilter(e.target.value)}
              className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Approval</option>
              <option value="true">Approved</option>
              <option value="false">Not Approved</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Status</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
              ))}
            </select>
            <button
              onClick={() => {
                setSearchTerm('');
                setLocationFilter('');
                setApprovedFilter('');
                setStatusFilter('');
              }}
              className="rounded-xl bg-red-100 px-4 py-2 text-sm text-red-600 transition hover:bg-red-200"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <EventTable items={currentItems} theme={theme} onEdit={handleEdit} onDelete={confirmDelete} />
        <EventPagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} theme={theme} />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className={`bg-white rounded-lg shadow-lg p-6 w-full max-w-md ${theme.startsWith('dark') ? 'bg-gray-800 text-white' : ''}`}>
            {modalMode === 'edit' && (
              <EventEditModal
                selectedItem={selectedItem}
                uniqueStatuses={uniqueStatuses}
                theme={theme}
                handleCancel={handleCancel}
                confirmUpdate={confirmUpdate}
                setSelectedItem={setSelectedItem}
              />
            )}
            {modalMode === 'update-confirm' && (
              <EventUpdateConfirmModal
                theme={theme}
                handleUpdate={handleUpdate}
                setModalMode={setModalMode}
              />
            )}
            {modalMode === 'delete' && (
              <EventDeleteModal
                theme={theme}
                handleCancel={handleCancel}
                handleDelete={handleDelete}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;