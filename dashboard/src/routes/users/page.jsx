import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import UserTable from "../../components/user_management/UserTable";
import Pagination from "../../components/user_management/Pagination";
import EditModal from "../../modals/user/BanModal";
import DeleteModal from "../../modals/user/DeleteModal";
import { ThemeProviderContext } from "../../contexts/theme-context";
import { API_BASE } from "../../configs/url";

const UserManagementPage = () => {
    const { theme } = useContext(ThemeProviderContext);
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({ provider: "", status: "", rating: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const [modalState, setModalState] = useState({ show: false, mode: "", selectedItem: null, deleteId: null });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const itemsPerPage = 8;

    useEffect(() => {
        fetchData();
    }, []);
    
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`${API_BASE}/users/getall`);
            // Map 'image' to 'profilePic' for table compatibility
            const mappedData = res.data.map(user => ({
                ...user,
                image: user.image || null
            }));
            const sortedData = mappedData.sort((a, b) => a.id.localeCompare(b.id));
            setData(sortedData);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to load users. Please try again later.");
            setData([]);
        } finally {
            setLoading(false);
        }
    };

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
            await axios.put(`${API_BASE}/users/ban/${updatedUser.id}`);
            // Toggle isBanned locally for immediate UI update
            setData((prev) => prev.map((item) => (item.id === updatedUser.id ? { ...item, isBanned: !item.isBanned } : item)));
            handleCancel();
        } catch (error) {
            console.error("Error banning user:", error);
            setError("Failed to ban user. Please try again.");
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${API_BASE}/users/delete/${modalState.deleteId}`);
            setData((prev) => prev.filter((item) => item.id !== modalState.deleteId));
            handleCancel();
        } catch (error) {
            console.error("Error deleting user:", error);
            setError("Failed to delete user. Please try again.");
        }
    };

    const uniqueProviders = [...new Set(data.map((item) => (item.isProvider ? "Provider" : "User")))];
    const uniqueStatuses = [...new Set(data.map((item) => item.status))];

    const filteredData = data.filter(
        (item) =>
            (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (filters.provider ? (filters.provider === "Provider" ? item.isProvider : !item.isProvider) : true) &&
            (filters.status ? item.status === filters.status : true) &&
            (filters.rating ? item.rating >= parseFloat(filters.rating) : true),
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className={`min-h-screen p-6 ${theme.startsWith("dark") ? "bg-gray-900" : "bg-[#f5f9f6]"}`}>
            <div className="mx-auto max-w-7xl">
                <h1 className={`mb-6 text-3xl font-bold ${theme.startsWith("dark") ? "text-blue-300" : "text-blue-700"}`}>User Management</h1>

                {error && (
                    <div className={`mb-4 p-4 rounded-lg ${theme.startsWith("dark") ? "bg-red-900/20 text-red-300" : "bg-red-50 text-red-600"}`}>
                        {error}
                    </div>
                )}

                {/* Search and Filters */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`flex-1 rounded-xl border border-gray-300 px-4 py-2 shadow-sm transition focus:outline-none ${theme.startsWith("dark") ? "bg-gray-800 text-white focus:ring-2 focus:ring-blue-400" : "focus:ring-2 focus:ring-green-400"}`}
                    />
                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={filters.provider || ""}
                            onChange={(e) => handleFilterChange("provider", e.target.value)}
                            className={`rounded-xl border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${theme.startsWith("dark") ? "bg-gray-800 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}
                        >
                            <option value="">All Users</option>
                            {uniqueProviders.map((prov, idx) => (
                                <option
                                    key={prov || idx}
                                    value={prov}
                                >
                                    {prov}
                                </option>
                            ))}
                        </select>
                        <select
                            value={filters.status}
                            onChange={(e) => handleFilterChange("status", e.target.value)}
                            className={`rounded-xl border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${theme.startsWith("dark") ? "bg-gray-800 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}
                        >
                            <option value="">Status</option>
                            {uniqueStatuses.map((status, idx) => (
                                <option
                                    key={status || idx}
                                    value={status}
                                >
                                    {status}
                                </option>
                            ))}
                        </select>
                        <select
                            value={filters.rating}
                            onChange={(e) => handleFilterChange("rating", e.target.value)}
                            className={`rounded-xl border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 ${theme.startsWith("dark") ? "bg-gray-800 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"}`}
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

                {loading ? (
                    <div className="text-center py-10 text-lg text-blue-500">Loading users...</div>
                ) : (
                    <>
                        <UserTable
                            items={currentItems}
                            onEdit={handleBan}
                            onDelete={confirmDelete}
                        />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}

                {/* Modal */}
                {modalState.show && modalState.mode === "ban" && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div
                            className={`w-full max-w-md rounded-lg bg-white p-6 shadow-lg ${theme.startsWith("dark") ? "bg-gray-800 text-white" : ""}`}
                        >
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
                        <div
                            className={`w-full max-w-md rounded-lg bg-white p-6 shadow-lg ${theme.startsWith("dark") ? "bg-gray-800 text-white" : ""}`}
                        >
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
