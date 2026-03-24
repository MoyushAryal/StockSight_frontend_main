import React from "react";
import Timebar from "./components/timeBar";
import Topright from "./components/topRight";
import Middlesection from "./components/middleSection";
import Graphanalysis from "./components/graphAnalysis";
import NewsSection from "./components/newsSection";

function Dashboard() {
    return (
        <div className="flex-1 p-5 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
            <p className="font-bold text-2xl fade-in text-gray-800 dark:text-gray-100">
                Greetings, <span className="text-blue-600">Moyush</span>
            </p>

            <div className="flex gap-12 mt-6 mb-8 fade-in-delay--1">
                <Timebar />
                <Topright />
            </div>

            <div className="fade-in-delay-2">
                <Middlesection />
            </div>

            <div className="mt-4 flex gap-6 fade-in-delay-2 w-full">
                <div className="flex-1 min-w-0">
                    <Graphanalysis />
                </div>
                <div className="w-[520px] flex-shrink-0">
                    <NewsSection />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;