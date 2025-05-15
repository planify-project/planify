import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import UserTable from "../../components/user_management/UserTable";
import Pagination from "../../components/user_management/Pagination";
import EditModal from "../../modals/user/BanModal";
import DeleteModal from "../../modals/user/DeleteModal";
import { ThemeProviderContext } from "../../contexts/theme-context";

const UserManagementPage = () => {
    const { theme } = useContext(ThemeProviderContext);
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({ provider: "", status: "", rating: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const [modalState, setModalState] = useState({ show: false, mode: "", selectedItem: null, deleteId: null });
    const itemsPerPage = 8;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:3000/api/users/getall");
                const sortedData = res.data.sort((a, b) => a.id.localeCompare(b.id));
                setData(sortedData);
            } catch (err) {
                console.log("Error fetching data:", err);
            }
        };
        fetchData();
    }, []);

    const handleFilterChange = (name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const resetFilters = () => {
        setSearchTerm("");
        setFilters({ provider: "", status: "", rating: "" });
    };

    const handleBan = (item) => {
        setModalState({ show: true, mode: "ban", selectedItem: item, deleteId: null });
    };

    const confirmDelete = (id) => {
        setModalState({ show: true, mode: "delete", selectedItem: null, deleteId: id });
    };

    const handleCancel = () => {
        setModalState({ show: false, mode: "", selectedItem: null, deleteId: null });
    };

    const handleBand = async (updatedUser) => {
        try {
            const res = await axios.put(`http://localhost:3000/api/users/ban/${updatedUser.id}`);
            // Toggle isBanned locally for immediate UI update
            setData((prev) =>
                prev.map((item) =>
                    item.id === updatedUser.id
                        ? { ...item, isBanned: !item.isBanned }
                        : item
                )
            );
            handleCancel();
        } catch (error) {
            console.log("Error updating data:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:3000/api/users/delete/${modalState.deleteId}`);
            setData((prev) => prev.filter((item) => item.id !== modalState.deleteId));
            handleCancel();
        } catch (error) {
            console.log(error);
        }
    };

    const uniqueProviders = [...new Set(data.map((item) => item.isProvider ? 'Provider' : 'User'))];
    const uniqueStatuses = [...new Set(data.map((item) => item.status))];

    const filteredData = data.filter(
        (item) =>
            (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (filters.provider ? (filters.provider === 'Provider' ? item.isProvider : !item.isProvider) : true) &&
            (filters.status ? item.status === filters.status : true) &&
            (filters.rating ? item.rating >= parseFloat(filters.rating) : true)
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className={`min-h-screen p-6 ${theme.startsWith('dark') ? 'bg-gray-900' : 'bg-[#f5f9f6]'}`}>
            <div className="max-w-7xl mx-auto">
                <h1 className={`text-3xl font-bold mb-6 ${theme.startsWith('dark') ? 'text-blue-300' : 'text-blue-700'}`}>User Management</h1>
                {/* Search and Filters */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none shadow-sm transition ${theme.startsWith('dark') ? 'bg-gray-800 text-white focus:ring-2 focus:ring-blue-400' : 'focus:ring-2 focus:ring-green-400'}`}
                    />
                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={filters.provider || ''}
                            onChange={(e) => handleFilterChange("provider", e.target.value)}
                            className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                            <option value="">All Users</option>
                            {uniqueProviders.map((prov, idx) => (
                                <option key={prov || idx} value={prov}>{prov}</option>
                            ))}
                        </select>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange("status", e.target.value)}
                            className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                            <option value="">Status</option>
                            {uniqueStatuses.map((status, idx) => (
                                <option key={status || idx} value={status}>{status}</option>
                            ))}
                        </select>
                        <select
                            value={filters.rating}
                            onChange={(e) => handleFilterChange("rating", e.target.value)}
                            className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                            <option value="">All Ratings</option>
                            <option value="4">4+ Stars</option>
                            <option value="3">3+ Stars</option>
                            <option value="2">2+ Stars</option>
                            <option value="1">1+ Stars</option>
                        </select>
                        <button
                            onClick={resetFilters}
                            className="rounded-xl bg-red-100 px-4 py-2 text-sm text-red-600 transition hover:bg-red-200"
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>
                <UserTable items={currentItems} onEdit={handleBan} onDelete={confirmDelete} />
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                {/* Modal */}
                {modalState.show && modalState.mode === "ban" && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className={`bg-white rounded-lg shadow-lg p-6 w-full max-w-md ${theme.startsWith('dark') ? 'bg-gray-800 text-white' : ''}`}>
                            <EditModal
                                isOpen={modalState.show && modalState.mode === "ban"}
                                user={modalState.selectedItem}
                                onClose={handleCancel}
                                onSave={handleBand}
                            />
                        </div>
                    </div>
                )}
                {modalState.show && modalState.mode === "delete" && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className={`bg-white rounded-lg shadow-lg p-6 w-full max-w-md ${theme.startsWith('dark') ? 'bg-gray-800 text-white' : ''}`}>
                            <DeleteModal
                                isOpen={modalState.show && modalState.mode === "delete"}
                                onClose={handleCancel}
                                onConfirm={handleDelete}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagementPage;
