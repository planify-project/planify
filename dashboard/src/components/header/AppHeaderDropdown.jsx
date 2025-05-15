import { useState, useContext } from "react";
import { Menu } from "@headlessui/react";
import { FiMessageSquare, FiCheckSquare, FiUser, FiCreditCard, FiLogOut } from "react-icons/fi";
import { ThemeProviderContext } from "../../contexts/theme-context.jsx";
import { AuthContext } from "../../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const AccountDropdown = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { theme } = useContext(ThemeProviderContext);
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const accountItems = [
        { icon: <FiMessageSquare className="h-5 w-5" />, text: "Messages", count: 42 },
        { icon: <FiCheckSquare className="h-5 w-5" />, text: "Tasks", count: 42 },
    ];

    const settingsItems = [
        { icon: <FiUser className="h-5 w-5" />, text: "Profile" },
        { icon: <FiCreditCard className="h-5 w-5" />, text: "Payments", count: 42 },
        { icon: <FiLogOut className="h-5 w-5" />, text: "Logout", isRed: true, onClick: handleLogout },
    ];

    return (
        <Menu
            as="div"
            className="relative inline-block text-left"
        >
            <div>
                <Menu.Button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`cursor-pointer rounded-full p-2 hover:bg-gray-100 dark:hover:bg-slate-800`}
                >
                    <span className="sr-only">Account menu</span>
                    <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-white ${user?.photoURL ? "" : "bg-blue-500"}`}
                        style={
                            user?.photoURL
                                ? {
                                      backgroundImage: `url(${user.photoURL})`,
                                      backgroundSize: "cover",
                                      backgroundPosition: "center",
                                      backgroundRepeat: "no-repeat",
                                  }
                                : {}
                        }
                    >
                        {!user?.photoURL && (user?.displayName?.[0] || user?.email?.[0] || "A")}
                    </div>
                </Menu.Button>
            </div>

            <Menu.Items
                className={`absolute right-0 mt-2 w-64 origin-top-right divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${theme === "dark" ? "divide-gray-700 bg-slate-900 text-white" : "bg-white"}`}
            >
                {/* Account Section */}
                <div className="p-2">
                    <h3 className={`px-3 py-2 text-xs font-medium uppercase ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Account</h3>
                    {accountItems.map((item, index) => (
                        <Menu.Item key={index}>
                            {({ active }) => (
                                <button
                                    className={`${active ? (theme === "dark" ? "bg-slate-800" : "bg-gray-100") : ""} group flex w-full items-center justify-between rounded-md px-3 py-2 text-sm`}
                                >
                                    <div className="flex items-center space-x-3">
                                        {item.icon}
                                        <span className={theme === "dark" ? "text-gray-200" : "text-gray-700"}>{item.text}</span>
                                    </div>
                                    {item.count && (
                                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">{item.count}</span>
                                    )}
                                </button>
                            )}
                        </Menu.Item>
                    ))}
                </div>

                {/* Settings Section */}
                <div className="p-2">
                    <h3 className={`px-3 py-2 text-xs font-medium uppercase ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>Settings</h3>
                    {settingsItems.map((item, index) => (
                        <Menu.Item key={index}>
                            {({ active }) => (
                                <button
                                    className={`${active ? (theme === "dark" ? "bg-slate-800" : "bg-gray-100") : ""} group flex w-full items-center ${item.isRed ? "text-red-600" : theme === "dark" ? "text-gray-200" : "text-gray-700"} justify-between rounded-md px-3 py-2 text-sm`}
                                    onClick={item.onClick}
                                >
                                    <div className="flex items-center space-x-3">
                                        {item.icon}
                                        <span>{item.text}</span>
                                    </div>
                                    {item.count && (
                                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">{item.count}</span>
                                    )}
                                </button>
                            )}
                        </Menu.Item>
                    ))}
                </div>
            </Menu.Items>
        </Menu>
    );
};

export default AccountDropdown;
