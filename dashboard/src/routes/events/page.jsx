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
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [allTypes, setAllTypes] = useState([]);

  // Fetch events from backend with pagination and filters
  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: itemsPerPage,
      };
      if (searchTerm) params.search = searchTerm;
      if (locationFilter) params.location = locationFilter;
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.type = typeFilter;
      const res = await axios.get('http://localhost:3000/api/events/getAll', { params });
      setData(res.data.events || []);
      setTotalPages(res.data.totalPages || 1);
      setCurrentPage(res.data.page || 1);
    } catch (err) {
      setData([]);
      setTotalPages(1);
      setCurrentPage(1);
      console.log('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all event types for the type filter
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/events/types');
        setAllTypes(res.data.types || []);
      } catch (err) {
        setAllTypes([]);
      }
    };
    fetchTypes();
  }, []);

  // Fetch on mount and when filters/page/search change
  useEffect(() => {
    fetchData(currentPage);
    // eslint-disable-next-line
  }, [currentPage, searchTerm, locationFilter, statusFilter, typeFilter]);

  const confirmDelete = (id) => {
    setDeleteId(id);
    setModalMode('delete');
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/event/${deleteId}`);
      fetchData(currentPage);
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
    // Only allow update if event is public
    if (selectedItem && selectedItem.isPublic) {
      setModalMode('update-confirm');
    } else {
      alert('Only public events can be approved or rejected by admin.');
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3000/api/events/admin-update/${selectedItem.id}`, selectedItem);
      fetchData(currentPage);
      setShowModal(false);
      setSelectedItem(null);
      setModalMode('');
    } catch (error) {
      console.log('Error updating data:', error);
    }
  };

  // Unique filter values from current data
  const uniqueLocations = [...new Set(data.map(item => item.location))];
  // Use allTypes for event type filtering
  const uniqueTypes = allTypes;
  // Only allow admin to set status to 'approved' or 'rejected' in the edit modal
  const uniqueStatuses = ['approved', 'rejected'];
  // For status filtering, allow all possible statuses
  const allStatuses = ['approved', 'rejected', 'pending', 'cancelled', 'completed'];

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
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className={`flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none shadow-sm transition ${theme.startsWith('dark') ? 'bg-gray-800 text-white focus:ring-2 focus:ring-blue-400' : 'focus:ring-2 focus:ring-blue-400'}`}
          />
          <div className="flex flex-wrap items-center gap-3">
            {/* Location Filter */}
            <select
              value={locationFilter}
              onChange={(e) => { setLocationFilter(e.target.value); setCurrentPage(1); }}
              className={`rounded-xl border border-gray-300 ${theme.startsWith('dark') ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400`}
            >
              <option value="">All Locations</option>
              {uniqueLocations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className={`rounded-xl border border-gray-300 ${theme.startsWith('dark') ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400`}
            >
              <option value="">Status</option>
              {allStatuses.map(status => (
                <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
              ))}
            </select>
            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
              className={`rounded-xl border border-gray-300 ${theme.startsWith('dark') ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'} px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400`}
            >
              <option value="">All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
            {/* Reset Button */}
            <button
              onClick={() => {
                setSearchTerm('');
                setLocationFilter('');
                setStatusFilter('');
                setTypeFilter('');
                setCurrentPage(1);
              }}
              className="rounded-xl bg-red-100 px-4 py-2 text-sm text-red-600 transition hover:bg-red-200"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-lg text-blue-500">Loading events...</div>
        ) : (
          <EventTable items={data} theme={theme} onEdit={handleEdit} onDelete={confirmDelete} />
        )}
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