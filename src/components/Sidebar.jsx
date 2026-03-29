import React from "react";
import SideButton from "./sideBarButton";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
    const navigation = useNavigate();
    const location = useLocation();

    const menuItems = [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Stocks", path: "/stock-listing" },
        { name: "Prediction Panel", path: "/prediction-panel" },
        { name: "News", path: "/news" },
        { name: "Bookmarks", path: "/bookmarks" }
    ];

    const handleLogout = async () => {
        try {
            await fetch("http://127.0.0.1:8000/api/users/logout/", {
                method: "POST",
                headers: {
                    "Authorization": `Token ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            });
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            navigation("/login");
        }
    };

    return (
        <div className="w-72 flex flex-col min-h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <h3 className="ml-6 pt-6 pb-4 text-gray-300 dark:text-gray-600">User panel</h3>

            <div className="flex-1">
                <div className="space-y-2 px-3">
                    {menuItems.map((item) => (
                        <div
                            key={item.name}
                            onClick={() => navigation(item.path)}
                            className="cursor-pointer"
                        >
                            <SideButton
                                text={item.name}
                                active={location.pathname === item.path}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div
                onClick={handleLogout}
                className="px-6 font-bold mb-6 cursor-pointer py-4 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 transition-colors duration-300"
            >
                Logout
            </div>
        </div>
    );
}

export default Sidebar;