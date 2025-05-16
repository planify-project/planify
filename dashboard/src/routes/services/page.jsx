import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import ServiceTable from "../../components/services/ServiceTable";
import ServicePagination from "../../components/services/ServicePagination";
import ServiceEditModal from "../../modals/services/ServiceEditModal";
import ServiceUpdateConfirmModal from "../../modals/services/ServiceUpdateConfirmModal";
import ServiceDeleteModal from "../../modals/services/ServiceDeleteModal";
import { ThemeProviderContext } from "../../contexts/theme-context";
import { useNavigate } from "react-router-dom";

const ServicesPage = () => {
    const { theme } = useContext(ThemeProviderContext);
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({ location: "", serviceType: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const [modalState, setModalState] = useState({ show: false, mode: "", selectedItem: null, deleteId: null });
    const itemsPerPage = 8;

    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/services");
            // If your backend returns { success, data }, use res.data.data
            const services = res.data.data || res.data;
            const sortedData = services.sort((a, b) => a.id - b.id);
            setData(sortedData);
        } catch (err) {
            console.log("Error fetching data:", err);
        }
    };
    const handleFilterChange = (name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const resetFilters = () => {
        setSearchTerm("");
        setFilters({ location: "", serviceType: "" });
    };

    const handleEdit = (item) => {
        setModalState({ show: true, mode: "edit", selectedItem: item, deleteId: null });
    };

    const confirmDelete = (id) => {
        setModalState({ show: true, mode: "delete", selectedItem: null, deleteId: id });
    };

    const handleCancel = () => {
        setModalState({ show: false, mode: "", selectedItem: null, deleteId: null });
    };

    const confirmUpdate = () => {
        setModalState((prev) => ({ ...prev, mode: "update-confirm" }));
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:3000/api/inNeed/${modalState.selectedItem.id}`, modalState.selectedItem);
            setData((prev) => prev.map((item) => (item.id === modalState.selectedItem.id ? modalState.selectedItem : item)));
            handleCancel();
        } catch (error) {
            console.log("Error updating data:", error);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:3000/api/inNeed/${modalState.deleteId}`);
            setData((prev) => prev.filter((item) => item.id !== modalState.deleteId));
            handleCancel();
        } catch (error) {
            console.log(error);
        }
    };

    const uniqueLocations = [...new Set(data.map((item) => item.location))];
    const uniqueServiceTypes = [...new Set(data.map((item) => item.serviceType || "general"))];

    const filteredData = data.filter(
        (item) =>
            (item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (filters.location ? item.location === filters.location : true) &&
            (filters.serviceType ? item.serviceType === filters.serviceType : true),
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className={`min-h-screen p-6 ${theme.startsWith("dark") ? "bg-gray-900" : "bg-[#f5f9f6]"}`}>
            <div className="mx-auto max-w-7xl">
                <h1 className={`mb-6 text-3xl font-bold ${theme.startsWith("dark") ? "text-blue-300" : "text-blue-700"}`}>Service Management</h1>
                {/* Search and Filters */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <input
                        type="text"
                        placeholder="Search by title or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`flex-1 rounded-xl border border-gray-300 px-4 py-2 shadow-sm transition focus:outline-none ${theme.startsWith("dark") ? "bg-gray-800 text-white focus:ring-2 focus:ring-blue-400" : "focus:ring-2 focus:ring-green-400"}`}
                    />
                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={filters.location || ""}
                            onChange={(e) => handleFilterChange("location", e.target.value)}
                            className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                            <option value="">All Locations</option>
                            {uniqueLocations.map((loc, idx) => (
                                <option
                                    key={loc || idx}
                                    value={loc}
                                >
                                    {loc}
                                </option>
                            ))}
                        </select>
                        <select
                            value={filters.serviceType || ""}
                            onChange={(e) => handleFilterChange("serviceType", e.target.value)}
                            className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                        >
                            <option value="">All Types</option>
                            {uniqueServiceTypes.map((type, idx) => (
                                <option
                                    key={type || idx}
                                    value={type}
                                >
                                    {type}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={resetFilters}
                            className="rounded-xl bg-red-100 px-4 py-2 text-sm text-red-600 transition hover:bg-red-200"
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>
                <ServiceTable
                    items={currentItems}
                    onEdit={handleEdit}
                    onDelete={confirmDelete}
                    navigate={navigate}
                    showPrice
                    showServiceType
                    showImage
                />
                <ServicePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                    theme={theme}
                />
                {/* Modal */}
                {modalState.show && modalState.mode === "edit" && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div
                            className={`w-full max-w-md rounded-lg bg-white p-6 shadow-lg ${theme.startsWith("dark") ? "bg-gray-800 text-white" : ""}`}
                        >
                            <ServiceEditModal
                                selectedItem={modalState.selectedItem}
                                setSelectedItem={(item) => setModalState((prev) => ({ ...prev, selectedItem: item }))}
                                onCancel={handleCancel}
                                onSave={confirmUpdate}
                            />
                        </div>
                    </div>
                )}
                {modalState.show && modalState.mode === "update-confirm" && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div
                            className={`w-full max-w-md rounded-lg bg-white p-6 shadow-lg ${theme.startsWith("dark") ? "bg-gray-800 text-white" : ""}`}
                        >
                            <ServiceUpdateConfirmModal
                                onBack={() => setModalState((prev) => ({ ...prev, mode: "edit" }))}
                                onConfirm={handleUpdate}
                            />
                        </div>
                    </div>
                )}
                {modalState.show && modalState.mode === "delete" && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div
                            className={`w-full max-w-md rounded-lg bg-white p-6 shadow-lg ${theme.startsWith("dark") ? "bg-gray-800 text-white" : ""}`}
                        >
                            <ServiceDeleteModal
                                onCancel={handleCancel}
                                onDelete={handleDelete}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServicesPage;
