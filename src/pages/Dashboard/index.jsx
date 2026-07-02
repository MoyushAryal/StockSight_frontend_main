
import React, { useEffect, useState } from "react";
import Timebar from "./components/timeBar";
import Topright from "./components/topRight";
import Graphanalysis from "./components/graphAnalysis";
import NewsSection from "./components/newsSection";

function Dashboard() {
    const getDisplayName = () => localStorage.getItem("display_name") || localStorage.getItem("username") || "User";
    const [username, setUsername] = useState(getDisplayName);

    useEffect(() => {
        const syncUsername = () => {
            setUsername(getDisplayName());
        };

        window.addEventListener("auth-user-changed", syncUsername);
        window.addEventListener("storage", syncUsername);

        return () => {
            window.removeEventListener("auth-user-changed", syncUsername);
            window.removeEventListener("storage", syncUsername);
        };
    }, []);

    return (
        <div className="flex-1 p-5 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen overflow-hidden transition-colors duration-300">
            <p className="font-bold text-2xl fade-in text-gray-800 dark:text-gray-100">
                Greetings, <span className="text-blue-600">{username}</span>
            </p>

            <div className="flex flex-col gap-6 mt-6 mb-8 fade-in-delay--1 min-w-0 2xl:flex-row">
                <Timebar />
                <Topright />
            </div>

            <div className="mt-4 flex gap-6 fade-in-delay-2 w-full min-w-0">
                <div className="flex-1 min-w-0 overflow-hidden">
                    <Graphanalysis />
                </div>
                <div className="w-80 xl:w-[400px] flex-shrink-0">
                    <NewsSection />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
